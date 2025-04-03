package com.esprit.easyorder.gestionproduits.services;

import com.esprit.easyorder.gestionproduits.entities.Produit;
import com.esprit.easyorder.gestionproduits.repositories.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProduitService {
    @Autowired
    private ProduitRepository produitRepository;

    public List<Produit> getAllProduits() {
        return produitRepository.findAll();
    }

    public Produit getProduitById(Long id) {
        Optional<Produit> produit = produitRepository.findById(id);
        if (!produit.isPresent()) {
            throw new RuntimeException("Produit non trouvé avec l'ID : " + id);
        }
        return produit.get();
    }

    public List<Produit> getProduitsByIds(List<Long> ids) {
        return produitRepository.findByIdIn(ids);
    }

    public Produit saveProduit(Produit produit) {
        return produitRepository.save(produit);
    }

    public Produit updateProduit(Long id, Produit updatedProduit) {
        Produit existingProduit = getProduitById(id);
        existingProduit.setNom(updatedProduit.getNom());
        existingProduit.setPrix(updatedProduit.getPrix());
        existingProduit.setCommandeIds(updatedProduit.getCommandeIds());
        return produitRepository.save(existingProduit);
    }

    public void deleteProduit(Long id) {
        Produit produit = getProduitById(id);
        produitRepository.delete(produit);
    }
}