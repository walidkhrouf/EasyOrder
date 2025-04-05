package com.esprit.easyorder.gestionlivraison.repositories;

import com.esprit.easyorder.gestionlivraison.entities.Livraison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LivraisonRepository extends JpaRepository<Livraison, Long> {
}