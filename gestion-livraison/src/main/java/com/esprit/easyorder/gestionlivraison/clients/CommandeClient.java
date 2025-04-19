package com.esprit.easyorder.gestionlivraison.clients;

import com.esprit.easyorder.gestionlivraison.dto.CommandeDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "GESTION-COMMANDES", url = "${gestion-commandes.url:http://gestion-commandes:8083}")
public interface CommandeClient {
    @GetMapping("/api/commandes/{id}")
    CommandeDTO getCommandeById(@PathVariable("id") Long id);
}