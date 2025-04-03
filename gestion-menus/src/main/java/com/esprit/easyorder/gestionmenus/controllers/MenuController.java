package com.esprit.easyorder.gestionmenus.controllers;

import com.esprit.easyorder.gestionmenus.entities.Menu;
import com.esprit.easyorder.gestionmenus.services.MenuService;
import com.esprit.easyorder.gestionproduits.entities.Produit;
import com.esprit.easyorder.gestionmenus.clients.ProduitClient;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/menus")
public class MenuController {
    @Autowired
    private MenuService menuService;

    @Autowired
    private ProduitClient produitClient;

    @GetMapping
    public ResponseEntity<List<Menu>> getAllMenus() {
        List<Menu> menus = menuService.getAllMenus();
        return new ResponseEntity<>(menus, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Menu> getMenuById(@PathVariable("id") Long id) {
        try {
            Menu menu = menuService.getMenuById(id);
            return new ResponseEntity<>(menu, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<Menu> createMenu(@Valid @RequestBody Menu menu) {
        try {
            // Calculer le prix total en fonction des produits
            List<Produit> produits = produitClient.getProduitsByIds(menu.getProduitIds());
            Double prixTotal = produits.stream()
                    .mapToDouble(Produit::getPrix)
                    .sum();
            menu.setPrixTotal(prixTotal);

            // Définir la disponibilité par défaut à true si non spécifiée
            if (menu.getDisponible() == null) {
                menu.setDisponible(true);
            }

            Menu createdMenu = menuService.saveMenu(menu);
            return new ResponseEntity<>(createdMenu, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Menu> updateMenu(@PathVariable("id") Long id, @Valid @RequestBody Menu menu) {
        try {
            // Calculer le prix total en fonction des produits
            List<Produit> produits = produitClient.getProduitsByIds(menu.getProduitIds());
            Double prixTotal = produits.stream()
                    .mapToDouble(Produit::getPrix)
                    .sum();
            menu.setPrixTotal(prixTotal);

            Menu updatedMenu = menuService.updateMenu(id, menu);
            return new ResponseEntity<>(updatedMenu, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable("id") Long id) {
        try {
            menuService.deleteMenu(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Nouvelle méthode pour filtrer les menus par catégorie
    @GetMapping("/categorie/{categorie}")
    public ResponseEntity<List<Menu>> getMenusByCategorie(@PathVariable("categorie") String categorie) {
        List<Menu> menus = menuService.getAllMenus().stream()
                .filter(menu -> menu.getCategorie().equalsIgnoreCase(categorie))
                .collect(Collectors.toList());
        return new ResponseEntity<>(menus, HttpStatus.OK);
    }

    // Nouvelle méthode pour filtrer les menus disponibles
    @GetMapping("/disponibles")
    public ResponseEntity<List<Menu>> getMenusDisponibles() {
        List<Menu> menus = menuService.getAllMenus().stream()
                .filter(Menu::getDisponible)
                .collect(Collectors.toList());
        return new ResponseEntity<>(menus, HttpStatus.OK);
    }
}