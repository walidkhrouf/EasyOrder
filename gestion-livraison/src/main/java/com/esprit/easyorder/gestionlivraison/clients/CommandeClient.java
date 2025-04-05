package com.esprit.easyorder.gestionlivraison.clients;

import com.esprit.easyorder.gestioncommandes.entities.Commande;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "GESTION-COMMANDES", url = "http://localhost:8083")
public interface CommandeClient {
    @GetMapping("/api/commandes/{id}")
    Commande getCommandeById(@PathVariable("id") Long id);
}