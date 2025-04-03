package com.esprit.easyorder.gestionmenus.services;

import com.esprit.easyorder.gestionmenus.clients.ProduitClient;
import com.esprit.easyorder.gestionmenus.entities.Menu;
import com.esprit.easyorder.gestionmenus.repositories.MenuRepository;
import com.esprit.easyorder.gestionproduits.entities.Produit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MenuService {
    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private ProduitClient produitClient;

    public List<Menu> getAllMenus() {
        return menuRepository.findAll();
    }

    public Menu getMenuById(Long id) {
        Optional<Menu> menu = menuRepository.findById(id);
        if (!menu.isPresent()) {
            throw new RuntimeException("Menu non trouvé avec l'ID : " + id);
        }
        return menu.get();
    }

    public Menu saveMenu(Menu menu) {
        // Valider l'existence des produits (relation many-to-many)
        List<Long> produitIds = menu.getProduitIds();
        if (produitIds == null || produitIds.isEmpty()) {
            throw new RuntimeException("La liste des IDs de produits ne peut pas être vide");
        }

        List<Produit> produits = produitClient.getProduitsByIds(produitIds);
        if (produits.size() != produitIds.size()) {
            throw new RuntimeException("Certains produits n'existent pas : " + produitIds);
        }

        return menuRepository.save(menu);
    }

    public Menu updateMenu(Long id, Menu updatedMenu) {
        Menu existingMenu = getMenuById(id);
        existingMenu.setNom(updatedMenu.getNom());
        existingMenu.setDescription(updatedMenu.getDescription());
        existingMenu.setCategorie(updatedMenu.getCategorie());
        existingMenu.setDisponible(updatedMenu.getDisponible());
        existingMenu.setImageUrl(updatedMenu.getImageUrl());
        existingMenu.setProduitIds(updatedMenu.getProduitIds());
        existingMenu.setPrixTotal(updatedMenu.getPrixTotal());
        existingMenu.setTags(updatedMenu.getTags());
        return saveMenu(existingMenu);
    }

    public void deleteMenu(Long id) {
        Menu menu = getMenuById(id);
        menuRepository.delete(menu);
    }
}