package com.esprit.easyorder.gestionproduits.controllers;

import com.esprit.easyorder.gestionproduits.entities.Produit;
import com.esprit.easyorder.gestionproduits.services.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produits")
public class ProduitController {
    @Autowired
    private ProduitService produitService;

    @PostMapping
    public ResponseEntity<Produit> createProduit(@RequestBody Produit produit) {
        Produit savedProduit = produitService.saveProduit(produit);
        return ResponseEntity.status(201).body(savedProduit);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produit> getProduitById(@PathVariable("id") Long id) {
        Produit produit = produitService.getProduitById(id);
        return ResponseEntity.ok(produit);
    }

    @GetMapping("/by-ids")
    public ResponseEntity<List<Produit>> getProduitsByIds(@RequestParam("ids") List<Long> ids) {
        List<Produit> produits = produitService.getProduitsByIds(ids);
        return ResponseEntity.ok(produits);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produit> updateProduit(@PathVariable("id") Long id, @RequestBody Produit produit) {
        produit.setId(id);
        Produit updatedProduit = produitService.updateProduit(id, produit);
        return ResponseEntity.ok(updatedProduit);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduit(@PathVariable("id") Long id) {
        produitService.deleteProduit(id);
        return ResponseEntity.noContent().build();
    }

    //get all proudcts
    @GetMapping
    public ResponseEntity<List<Produit>> getAllProduits() {
        List<Produit> produits = produitService.getAllProduits();
        return ResponseEntity.ok(produits);
    }
}