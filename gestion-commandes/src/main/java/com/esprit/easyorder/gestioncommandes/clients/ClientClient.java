package com.esprit.easyorder.gestioncommandes.clients;

import com.esprit.easyorder.gestioncommandes.dto.ClientDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "client-client", url = "${client.service.url:http://localhost:8088/api/clients}")
public interface ClientClient {

    @GetMapping("/{id}")
    ClientDTO getClientById(@PathVariable("id") Long id);

    @PutMapping("/{id}")
    ClientDTO updateClient(@PathVariable("id") Long id, @RequestBody ClientDTO client);
}