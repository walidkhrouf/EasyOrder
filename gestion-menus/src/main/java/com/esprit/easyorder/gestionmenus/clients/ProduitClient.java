package com.esprit.easyorder.gestionmenus.clients;

import com.esprit.easyorder.gestionproduits.entities.Produit;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "GESTION-PRODUITS", url = "http://localhost:8085")
public interface ProduitClient {
    @GetMapping("/api/produits/by-ids")
    List<Produit> getProduitsByIds(@RequestParam("ids") List<Long> ids);
}