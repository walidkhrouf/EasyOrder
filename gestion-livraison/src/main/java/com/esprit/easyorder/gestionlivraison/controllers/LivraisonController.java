package com.esprit.easyorder.gestionlivraison.controllers;

import com.esprit.easyorder.gestionlivraison.entities.Livraison;
import com.esprit.easyorder.gestionlivraison.services.LivraisonService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/livraisons")
public class LivraisonController {
    @Autowired
    private LivraisonService livraisonService;

    @GetMapping
    public ResponseEntity<List<Livraison>> getAllLivraisons() {
        List<Livraison> livraisons = livraisonService.getAllLivraisons();
        return new ResponseEntity<>(livraisons, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Livraison> getLivraisonById(@PathVariable("id") Long id) {
        try {
            Livraison livraison = livraisonService.getLivraisonById(id);
            return new ResponseEntity<>(livraison, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<?> createLivraison(@Valid @RequestBody Livraison livraison) {
        try {
            Livraison createdLivraison = livraisonService.saveLivraison(livraison);
            return new ResponseEntity<>(createdLivraison, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            if (e.getMessage().contains("Commande non trouvée")) {
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateLivraison(@PathVariable("id") Long id, @Valid @RequestBody Livraison livraison) {
        try {
            Livraison updatedLivraison = livraisonService.updateLivraison(id, livraison);
            return new ResponseEntity<>(updatedLivraison, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            if (e.getMessage().contains("Livraison non trouvée") || e.getMessage().contains("Commande non trouvée")) {
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLivraison(@PathVariable("id") Long id) {
        try {
            livraisonService.deleteLivraison(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}