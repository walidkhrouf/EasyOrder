package com.esprit.easyorder.gestioncommandes.services;

import com.esprit.easyorder.gestioncommandes.clients.ClientClient;
import com.esprit.easyorder.gestioncommandes.clients.ProduitClient;
import com.esprit.easyorder.gestioncommandes.entities.Commande;
import com.esprit.easyorder.gestioncommandes.entities.CommandeStatus;
import com.esprit.easyorder.gestioncommandes.repositories.CommandeRepository;
import com.esprit.easyorder.gestioncommandes.dto.ClientDTO;
import com.esprit.easyorder.gestioncommandes.dto.CommandeRequest;
import com.esprit.easyorder.gestioncommandes.dto.ProduitDTO;
import feign.FeignException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CommandeService {
    @Autowired
    private CommandeRepository commandeRepository;

    @Autowired
    private ClientClient clientClient;

    @Autowired
    private ProduitClient produitClient;

    public List<Commande> getAllCommandes() {
        return commandeRepository.findAll();
    }

    public Commande getCommandeById(Long id) {
        Optional<Commande> commande = commandeRepository.findById(id);
        if (!commande.isPresent()) {
            throw new RuntimeException("Commande non trouvée avec l'ID : " + id);
        }
        return commande.get();
    }

    public Commande saveCommande(CommandeRequest request) {
        // Créer la nouvelle commande
        Commande commande = new Commande();
        commande.setClientId(request.getClientId());
        commande.setProduitIds(request.getProduitIds());
        commande.setStatus(CommandeStatus.EN_ATTENTE);
        commande.setCreatedAt(LocalDateTime.now());

        if (commande.getClientId() == null) {
            throw new RuntimeException("L'ID du client est obligatoire");
        }

        if (commande.getProduitIds() == null || commande.getProduitIds().isEmpty()) {
            throw new RuntimeException("La liste des IDs de produits ne peut pas être vide");
        }

        try {
            // Vérifier si le client existe
            ClientDTO client = clientClient.getClientById(commande.getClientId());
            if (client == null) {
                throw new RuntimeException("Client non trouvé avec l'ID : " + commande.getClientId());
            }

            // Vérifier les produits
            List<Long> produitIds = commande.getProduitIds();
            List<ProduitDTO> produits = produitClient.getProduitsByIds(produitIds);
            if (produits == null || produits.size() != produitIds.size()) {
                throw new RuntimeException("Certains produits n'existent pas");
            }

            // Calculer le total
            double total = produits.stream().mapToDouble(ProduitDTO::getPrix).sum();
            commande.setTotal(total);

            // Sauvegarder la commande
            Commande savedCommande = commandeRepository.save(commande);

            // Mettre à jour les relations avec le client et les produits
            updateClientAndProductsRelations(savedCommande, client, produits);

            return savedCommande;
        } catch (FeignException e) {
            throw new RuntimeException("Erreur lors de la communication avec un service externe: " + e.getMessage());
        }
    }

    private void updateClientAndProductsRelations(Commande commande, ClientDTO client, List<ProduitDTO> produits) {
        // Mettre à jour le client
        List<Long> commandeIds = client.getCommandeIds() != null ? client.getCommandeIds() : new ArrayList<>();
        if (!commandeIds.contains(commande.getId())) {
            commandeIds.add(commande.getId());
            client.setCommandeIds(commandeIds);

            // Vérifier les données avant mise à jour
            if (client.getNom() == null || client.getNom().trim().isEmpty()) {
                throw new RuntimeException("Le nom du client est vide pour ID : " + client.getId());
            }
            if (client.getEmail() == null || client.getEmail().trim().isEmpty()) {
                throw new RuntimeException("L'email du client est vide pour ID : " + client.getId());
            }
            if (!client.getEmail().contains("@")) {
                throw new RuntimeException("L'email du client est invalide (manque @) pour ID : " + client.getId());
            }

            // Log détaillé pour déboguer
            System.out.println("Avant mise à jour du client : ID=" + client.getId() + ", nom=" + client.getNom() + ", email=" + client.getEmail() + ", commandeIds=" + client.getCommandeIds());

            // Appeler gestion-clients pour mettre à jour le client
            try {
                ClientDTO updatedClient = clientClient.updateClient(client.getId(), client);
                System.out.println("Client mis à jour avec succès : " + updatedClient);
            } catch (FeignException e) {
                System.err.println("Erreur lors de la mise à jour du client : " + e.getMessage());
                throw e; // Relancer l'exception pour qu'elle soit capturée par saveCommande
            }
        }

        // Mettre à jour les produits
        for (ProduitDTO produit : produits) {
            List<Long> produitCommandeIds = produit.getCommandeIds() != null ? produit.getCommandeIds() : new ArrayList<>();
            if (!produitCommandeIds.contains(commande.getId())) {
                produitCommandeIds.add(commande.getId());
                produit.setCommandeIds(produitCommandeIds);
                try {
                    produitClient.updateProduit(produit.getId(), produit);
                    System.out.println("Produit mis à jour avec succès : ID=" + produit.getId());
                } catch (FeignException e) {
                    System.err.println("Erreur lors de la mise à jour du produit ID=" + produit.getId() + ": " + e.getMessage());
                    throw e;
                }
            }
        }
    }

    public Commande updateCommande(Long id, Commande updatedCommande) {
        Commande existingCommande = getCommandeById(id);

        boolean clientOrProduitsChanged = false;

        if (updatedCommande.getClientId() != null && !updatedCommande.getClientId().equals(existingCommande.getClientId())) {
            existingCommande.setClientId(updatedCommande.getClientId());
            clientOrProduitsChanged = true;
        }

        if (updatedCommande.getProduitIds() != null && !updatedCommande.getProduitIds().isEmpty() &&
                !updatedCommande.getProduitIds().equals(existingCommande.getProduitIds())) {
            existingCommande.setProduitIds(updatedCommande.getProduitIds());
            clientOrProduitsChanged = true;
        }

        if (updatedCommande.getStatus() != null) {
            existingCommande.setStatus(updatedCommande.getStatus());
        }

        existingCommande.setUpdatedAt(LocalDateTime.now());

        if (clientOrProduitsChanged) {
            CommandeRequest request = new CommandeRequest();
            request.setClientId(existingCommande.getClientId());
            request.setProduitIds(existingCommande.getProduitIds());
            return saveCommande(request);
        }

        return commandeRepository.save(existingCommande);
    }

    public void deleteCommande(Long id) {
        Commande commande = getCommandeById(id);

        try {
            // Mettre à jour le client
            ClientDTO client = clientClient.getClientById(commande.getClientId());
            if (client != null) {
                List<Long> commandeIds = client.getCommandeIds();
                if (commandeIds != null) {
                    commandeIds.remove(commande.getId());
                    client.setCommandeIds(commandeIds);

                    // Vérifier les données avant mise à jour
                    if (client.getNom() == null || client.getNom().trim().isEmpty()) {
                        throw new RuntimeException("Le nom du client est vide pour ID : " + client.getId());
                    }
                    if (client.getEmail() == null || client.getEmail().trim().isEmpty()) {
                        throw new RuntimeException("L'email du client est vide pour ID : " + client.getId());
                    }
                    if (!client.getEmail().contains("@")) {
                        throw new RuntimeException("L'email du client est invalide (manque @) pour ID : " + client.getId());
                    }

                    clientClient.updateClient(client.getId(), client);
                }
            }

            // Mettre à jour les produits
            List<ProduitDTO> produits = produitClient.getProduitsByIds(commande.getProduitIds());
            for (ProduitDTO produit : produits) {
                List<Long> produitCommandeIds = produit.getCommandeIds();
                if (produitCommandeIds != null) {
                    produitCommandeIds.remove(commande.getId());
                    produit.setCommandeIds(produitCommandeIds);
                    produitClient.updateProduit(produit.getId(), produit);
                }
            }

            // Supprimer la commande
            commandeRepository.delete(commande);
        } catch (FeignException e) {
            throw new RuntimeException("Erreur lors de la communication avec un service externe: " + e.getMessage());
        }
    }
}