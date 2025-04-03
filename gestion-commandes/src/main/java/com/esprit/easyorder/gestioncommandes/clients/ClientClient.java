package com.esprit.easyorder.gestioncommandes.clients;

import com.esprit.easyorder.gestionclients.entities.Client;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "GESTION-CLIENTS", url = "http://localhost:8082")
public interface ClientClient {
    @GetMapping("/api/clients/{id}")
    Client getClientById(@PathVariable("id") Long id);

    @PutMapping("/api/clients/{id}")
    Client updateClient(@PathVariable("id") Long id, @RequestBody Client client);
}