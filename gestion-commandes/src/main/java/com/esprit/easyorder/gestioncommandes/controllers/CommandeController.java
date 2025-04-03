package com.esprit.easyorder.gestioncommandes.controllers;

import com.esprit.easyorder.gestioncommandes.entities.Commande;
import com.esprit.easyorder.gestioncommandes.services.CommandeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/commandes")
public class CommandeController {
    @Autowired
    private CommandeService commandeService;

    @GetMapping
    //@PreAuthorize("hasAuthority('client') or hasAuthority('admin')")
    public ResponseEntity<List<Commande>> getAllCommandes() {
        List<Commande> commandes = commandeService.getAllCommandes();
        return new ResponseEntity<>(commandes, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    //@PreAuthorize("hasAuthority('client') or hasAuthority('admin')")
    public ResponseEntity<Commande> getCommandeById(@PathVariable("id") Long id) {
        try {
            Commande commande = commandeService.getCommandeById(id);
            return new ResponseEntity<>(commande, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    //@PreAuthorize("hasAuthority('client')")
    public ResponseEntity<?> createCommande(@Valid @RequestBody Commande commande) {
        try {
            Commande createdCommande = commandeService.saveCommande(commande);
            return new ResponseEntity<>(createdCommande, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", HttpStatus.BAD_REQUEST.toString());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    //@PreAuthorize("hasAuthority('client') or hasAuthority('admin')")
    public ResponseEntity<Commande> updateCommande(@PathVariable("id") Long id, @Valid @RequestBody Commande commande) {
        try {
            Commande updatedCommande = commandeService.updateCommande(id, commande);
            return new ResponseEntity<>(updatedCommande, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    //@PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<Void> deleteCommande(@PathVariable("id") Long id) {
        try {
            commandeService.deleteCommande(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}