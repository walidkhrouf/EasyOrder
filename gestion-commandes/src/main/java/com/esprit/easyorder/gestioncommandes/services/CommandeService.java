package com.esprit.easyorder.gestioncommandes.services;

import com.esprit.easyorder.gestioncommandes.entities.Commande;
import com.esprit.easyorder.gestioncommandes.entities.CommandeStatus;
import com.esprit.easyorder.gestioncommandes.repositories.CommandeRepository;
import com.esprit.easyorder.gestioncommandes.dto.CommandeRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommandeService {
    private static final Logger log = LoggerFactory.getLogger(CommandeService.class);

    @Autowired
    private CommandeRepository commandeRepository;

    public List<Commande> getAllCommandes() {
        log.info("Récupération de toutes les commandes");
        List<Commande> commandes = commandeRepository.findAll();
        log.info("Nombre de commandes récupérées: {}", commandes.size());
        return commandes;
    }

    public Commande getCommandeById(Long id) {
        log.info("Récupération de la commande avec ID: {}", id);
        Optional<Commande> commande = commandeRepository.findById(id); // Fixed typo: cmdletRepository -> commandeRepository
        if (!commande.isPresent()) {
            log.error("Commande non trouvée avec l'ID: {}", id);
            throw new IllegalArgumentException("Commande non trouvée avec l'ID : " + id);
        }
        log.info("Commande trouvée: {}", commande.get());
        return commande.get();
    }

    public Commande saveCommande(CommandeRequest request) {
        log.info("Début de saveCommande avec clientId: {} et produitIds: {}", request.getClientId(), request.getProduitIds());

        // Créer une nouvelle commande
        Commande commande = new Commande();
        commande.setClientId(request.getClientId());
        commande.setProduitIds(request.getProduitIds());
        commande.setStatus(CommandeStatus.EN_ATTENTE);
        commande.setCreatedAt(LocalDateTime.now());
        commande.setTotal(0.0); // Pas de calcul du total, car pas d'accès à gestion-produits

        // Validation minimale
        if (commande.getClientId() == null) {
            log.error("L'ID du client est null");
            throw new IllegalArgumentException("L'ID du client est obligatoire");
        }

        if (commande.getProduitIds() == null || commande.getProduitIds().isEmpty()) {
            log.error("La liste des produitIds est vide ou null");
            throw new IllegalArgumentException("La liste des IDs de produits ne peut pas être vide");
        }

        // Sauvegarde dans la base de données H2
        log.info("Sauvegarde de la commande dans la base de données H2");
        Commande savedCommande = commandeRepository.save(commande);
        log.info("Commande sauvegardée avec succès: {}", savedCommande);

        return savedCommande;
    }

    public Commande updateCommande(Long id, Commande updatedCommande) {
        log.info("Mise à jour de la commande avec ID: {}", id);
        Commande existingCommande = getCommandeById(id);

        if (updatedCommande.getClientId() != null) {
            existingCommande.setClientId(updatedCommande.getClientId());
        }

        if (updatedCommande.getProduitIds() != null && !updatedCommande.getProduitIds().isEmpty()) {
            existingCommande.setProduitIds(updatedCommande.getProduitIds());
        }

        if (updatedCommande.getStatus() != null) {
            existingCommande.setStatus(updatedCommande.getStatus());
        }

        existingCommande.setUpdatedAt(LocalDateTime.now());

        Commande savedCommande = commandeRepository.save(existingCommande);
        log.info("Commande mise à jour avec succès: {}", savedCommande);
        return savedCommande;
    }

    public void deleteCommande(Long id) {
        log.info("Suppression de la commande avec ID: {}", id);
        Commande commande = getCommandeById(id);
        commandeRepository.delete(commande);
        log.info("Commande supprimée avec succès");
    }
}