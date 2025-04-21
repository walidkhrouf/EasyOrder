package com.esprit.easyorder.gestionmenus.dto;

import java.util.ArrayList;
import java.util.List;

public class ProduitDTO {
    private Long id;
    private String nom;
    private double prix;
    private List<Long> commandeIds = new ArrayList<>();

    // Constructeurs
    public ProduitDTO() {}

    public ProduitDTO(Long id, String nom, double prix, List<Long> commandeIds) {
        this.id = id;
        this.nom = nom;
        this.prix = prix;
        this.commandeIds = commandeIds != null ? commandeIds : new ArrayList<>();
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
        this.commandeIds = commandeIds != null ? commandeIds : new ArrayList<>();
    }
}