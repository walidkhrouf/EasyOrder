package com.esprit.easyorder.gestionlivraison.services;

import com.esprit.easyorder.gestionlivraison.clients.CommandeClient;
import com.esprit.easyorder.gestionlivraison.entities.Livraison;
import com.esprit.easyorder.gestionlivraison.entities.LivraisonStatus;
import com.esprit.easyorder.gestionlivraison.repositories.LivraisonRepository;
import com.esprit.easyorder.gestioncommandes.entities.Commande;
import feign.FeignException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LivraisonService {
    @Autowired
    private LivraisonRepository livraisonRepository;

    @Autowired
    private CommandeClient commandeClient;

    public List<Livraison> getAllLivraisons() {
        return livraisonRepository.findAll();
    }

    public Livraison getLivraisonById(Long id) {
        Optional<Livraison> livraison = livraisonRepository.findById(id);
        if (!livraison.isPresent()) {
            throw new RuntimeException("Livraison non trouvée avec l'ID : " + id);
        }
        return livraison.get();
    }

    public Livraison saveLivraison(Livraison livraison) {
        if (livraison.getCommandeId() == null) {
            throw new RuntimeException("L'ID de la commande est obligatoire");
        }

        if (livraison.getAdresse() == null || livraison.getAdresse().isEmpty()) {
            throw new RuntimeException("L'adresse de livraison est obligatoire");
        }

        try {
            Commande commande = commandeClient.getCommandeById(livraison.getCommandeId());
            if (commande == null) {
                throw new RuntimeException("Commande non trouvée avec l'ID : " + livraison.getCommandeId());
            }

            return livraisonRepository.save(livraison);
        } catch (FeignException e) {
            throw new RuntimeException("Erreur lors de la communication avec GESTION-COMMANDES: " + e.getMessage());
        }
    }

    public Livraison updateLivraison(Long id, Livraison updatedLivraison) {
        Livraison existingLivraison = getLivraisonById(id);

        boolean commandeOrAdresseChanged = false;

        if (updatedLivraison.getCommandeId() != null && !updatedLivraison.getCommandeId().equals(existingLivraison.getCommandeId())) {
            existingLivraison.setCommandeId(updatedLivraison.getCommandeId());
            commandeOrAdresseChanged = true;
        }

        if (updatedLivraison.getAdresse() != null && !updatedLivraison.getAdresse().isEmpty() &&
                !updatedLivraison.getAdresse().equals(existingLivraison.getAdresse())) {
            existingLivraison.setAdresse(updatedLivraison.getAdresse());
            commandeOrAdresseChanged = true;
        }

        if (updatedLivraison.getStatus() != null) {
            existingLivraison.setStatus(updatedLivraison.getStatus());
        }

        existingLivraison.setUpdatedAt(LocalDateTime.now());

        if (commandeOrAdresseChanged) {
            return saveLivraison(existingLivraison);
        }

        return livraisonRepository.save(existingLivraison);
    }

    public void deleteLivraison(Long id) {
        Livraison livraison = getLivraisonById(id);
        livraisonRepository.delete(livraison);
    }
}