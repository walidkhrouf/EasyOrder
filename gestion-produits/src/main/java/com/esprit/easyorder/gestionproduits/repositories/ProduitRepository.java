package com.esprit.easyorder.gestionproduits.repositories;

import com.esprit.easyorder.gestionproduits.entities.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {
    List<Produit> findByIdIn(List<Long> ids);
}