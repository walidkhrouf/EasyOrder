package com.esprit.easyorder.gestioncommandes.repositories;

import com.esprit.easyorder.gestioncommandes.entities.Commande;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommandeRepository  extends JpaRepository<Commande, Long> {
}
