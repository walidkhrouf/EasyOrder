package com.esprit.easyorder.gestioncommandes.controllers;

import com.esprit.easyorder.gestioncommandes.entities.Commande;
import com.esprit.easyorder.gestioncommandes.services.CommandeService;
import com.esprit.easyorder.gestioncommandes.dto.CommandeRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commandes")
public class CommandeController {
    private static final Logger log = LoggerFactory.getLogger(CommandeController.class);

    @Autowired
    private CommandeService commandeService;

    @GetMapping
    public ResponseEntity<List<Commande>> getAllCommandes() {
        log.info("Requête GET /api/commandes pour récupérer toutes les commandes");
        List<Commande> commandes = commandeService.getAllCommandes();
        log.info("Réponse: {} commandes trouvées", commandes.size());
        return new ResponseEntity<>(commandes, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Commande> getCommandeById(@PathVariable("id") Long id) {
        log.info("Requête GET /api/commandes/{}", id);
        Commande commande = commandeService.getCommandeById(id);
        log.info("Réponse: Commande trouvée: {}", commande);
        return new ResponseEntity<>(commande, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Commande> createCommande(@RequestBody CommandeRequest request) {
        log.info("Requête POST /api/commandes avec body: {}", request);
        Commande createdCommande = commandeService.saveCommande(request);
        log.info("Réponse: Commande créée: {}", createdCommande);
        return new ResponseEntity<>(createdCommande, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Commande> updateCommande(@PathVariable("id") Long id, @RequestBody Commande commande) {
        log.info("Requête PUT /api/commandes/{} avec body: {}", id, commande);
        Commande updatedCommande = commandeService.updateCommande(id, commande);
        log.info("Réponse: Commande mise à jour: {}", updatedCommande);
        return new ResponseEntity<>(updatedCommande, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommande(@PathVariable("id") Long id) {
        log.info("Requête DELETE /api/commandes/{}", id);
        commandeService.deleteCommande(id);
        log.info("Réponse: Commande supprimée avec succès");
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}