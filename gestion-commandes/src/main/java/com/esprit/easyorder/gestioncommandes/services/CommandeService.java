package com.esprit.easyorder.gestioncommandes.services;

import com.esprit.easyorder.gestioncommandes.clients.ClientClient;
import com.esprit.easyorder.gestioncommandes.clients.ProduitClient;
import com.esprit.easyorder.gestioncommandes.entities.Commande;
import com.esprit.easyorder.gestioncommandes.entities.CommandeStatus;
import com.esprit.easyorder.gestioncommandes.repositories.CommandeRepository;
import com.esprit.easyorder.gestionclients.entities.Client;
import com.esprit.easyorder.gestionproduits.entities.Produit;
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

    public Commande saveCommande(Commande commande) {

        if (commande.getClientId() == null) {
            throw new RuntimeException("L'ID du client est obligatoire");
        }

        if (commande.getProduitIds() == null || commande.getProduitIds().isEmpty()) {
            throw new RuntimeException("La liste des IDs de produits ne peut pas être vide");
        }

        try {

            Client client = clientClient.getClientById(commande.getClientId());
            if (client == null) {
                throw new RuntimeException("Client non trouvé avec l'ID : " + commande.getClientId());
            }


            List<Long> produitIds = commande.getProduitIds();
            List<Produit> produits = produitClient.getProduitsByIds(produitIds);

            if (produits == null || produits.size() != produitIds.size()) {
                throw new RuntimeException("Certains produits n'existent pas");
            }


            double total = produits.stream().mapToDouble(Produit::getPrix).sum();
            commande.setTotal(total);

            Commande savedCommande = commandeRepository.save(commande);


            updateClientAndProductsRelations(savedCommande, client, produits);

            return savedCommande;
        } catch (FeignException e) {
            throw new RuntimeException("Erreur lors de la communication avec un service externe: " + e.getMessage());
        }
    }

    private void updateClientAndProductsRelations(Commande commande, Client client, List<Produit> produits) {
        // Mettre à jour le client
        List<Long> commandeIds = client.getCommandeIds() != null ?
                client.getCommandeIds() : new ArrayList<>();
        if (!commandeIds.contains(commande.getId())) {
            commandeIds.add(commande.getId());
            client.setCommandeIds(commandeIds);
            clientClient.updateClient(client.getId(), client);
        }

        // Mettre à jour les produits
        for (Produit produit : produits) {
            List<Long> produitCommandeIds = produit.getCommandeIds() != null ?
                    produit.getCommandeIds() : new ArrayList<>();
            if (!produitCommandeIds.contains(commande.getId())) {
                produitCommandeIds.add(commande.getId());
                produit.setCommandeIds(produitCommandeIds);
                produitClient.updateProduit(produit.getId(), produit);
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
            return saveCommande(existingCommande);
        }


        return commandeRepository.save(existingCommande);
    }

    public void deleteCommande(Long id) {
        Commande commande = getCommandeById(id);


        Client client = clientClient.getClientById(commande.getClientId());
        if (client != null) {
            List<Long> commandeIds = client.getCommandeIds();
            if (commandeIds != null) {
                commandeIds.remove(commande.getId());
                client.setCommandeIds(commandeIds);
                clientClient.updateClient(client.getId(), client);
            }
        }


        List<Produit> produits = produitClient.getProduitsByIds(commande.getProduitIds());
        for (Produit produit : produits) {
            List<Long> produitCommandeIds = produit.getCommandeIds();
            if (produitCommandeIds != null) {
                produitCommandeIds.remove(commande.getId());
                produit.setCommandeIds(produitCommandeIds);
                produitClient.updateProduit(produit.getId(), produit);
            }
        }

        commandeRepository.delete(commande);
    }
}