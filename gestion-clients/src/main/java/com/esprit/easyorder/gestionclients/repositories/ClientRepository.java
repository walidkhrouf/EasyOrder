package com.esprit.easyorder.gestionclients.repositories;

import com.esprit.easyorder.gestionclients.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
}