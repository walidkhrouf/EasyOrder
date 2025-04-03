package com.esprit.easyorder.gestionproduits.entities;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Produit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @Positive(message = "Le prix doit être positif")
    private double prix;

    @ElementCollection
    private List<Long> commandeIds = new ArrayList<>(); // Relation many-to-many avec Commande

    public Produit() {
    }

    public Produit(String nom, double prix) {
        this.nom = nom;
        this.prix = prix;
    }

    // Getters et setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public double getPrix() {
        return prix;
    }

    public void setPrix(double prix) {
        this.prix = prix;
    }

    public List<Long> getCommandeIds() {
        return commandeIds;
    }

    public void setCommandeIds(List<Long> commandeIds) {
        this.commandeIds = commandeIds;
    }
}