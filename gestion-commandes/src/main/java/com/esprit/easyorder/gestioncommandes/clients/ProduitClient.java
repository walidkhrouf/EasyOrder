package com.esprit.easyorder.gestioncommandes.clients;

import com.esprit.easyorder.gestioncommandes.dto.ProduitDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "GESTION-PRODUITS", url = "${gestion-produits.url:http://gestion-produits:8085}")
public interface ProduitClient {
    @GetMapping("/api/produits/by-ids")
    List<ProduitDTO> getProduitsByIds(@RequestParam("ids") List<Long> ids);

    @PutMapping("/api/produits/{id}")
    ProduitDTO updateProduit(@PathVariable("id") Long id, @RequestBody ProduitDTO produit);
}