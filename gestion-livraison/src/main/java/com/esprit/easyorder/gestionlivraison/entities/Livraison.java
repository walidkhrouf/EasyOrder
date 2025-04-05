package com.esprit.easyorder.gestionlivraison.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
public class Livraison {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "L'ID de la commande est obligatoire")
    private Long commandeId;

    @NotBlank(message = "L'adresse de livraison est obligatoire")
    @JsonProperty("adresseLivraison")
    private String adresse;

    private LivraisonStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Livraison() {
        this.createdAt = LocalDateTime.now();
        this.status = LivraisonStatus.EN_COURS;
    }

    public Livraison(Long commandeId, String adresse) {
        this.commandeId = commandeId;
        this.adresse = adresse;
        this.createdAt = LocalDateTime.now();
        this.status = LivraisonStatus.EN_COURS;
    }

    // Getters et setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCommandeId() {
        return commandeId;
    }

    public void setCommandeId(Long commandeId) {
        this.commandeId = commandeId;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public LivraisonStatus getStatus() {
        return status;
    }

    public void setStatus(LivraisonStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}