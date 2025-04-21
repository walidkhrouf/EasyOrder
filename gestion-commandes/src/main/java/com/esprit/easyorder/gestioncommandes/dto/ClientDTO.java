package com.esprit.easyorder.gestioncommandes.dto;

import java.util.ArrayList;
import java.util.List;

public class ClientDTO {
    private Long id;
    private String nom;
    private String email;
    private List<Long> commandeIds = new ArrayList<>();

    // Constructeurs
    public ClientDTO() {}

    public ClientDTO(Long id, String nom, String email, List<Long> commandeIds) {
        this.id = id;
        this.nom = nom;
        this.email = email;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Long> getCommandeIds() {
        return commandeIds;
    }

    public void setCommandeIds(List<Long> commandeIds) {
        this.commandeIds = commandeIds != null ? commandeIds : new ArrayList<>();
    }
}