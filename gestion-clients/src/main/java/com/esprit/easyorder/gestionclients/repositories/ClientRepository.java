package com.esprit.easyorder.gestionclients.repositories;

import com.esprit.easyorder.gestionclients.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByNomContainingIgnoreCase(String nom);
    List<Client> findByEmailContainingIgnoreCase(String email);
    List<Client> findByTelephoneContaining(String telephone);
}