package com.esprit.easyorder.gestioncommandes.entities;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "L'ID du client est obligatoire")
    private Long clientId;

    @NotEmpty(message = "La liste des IDs de produits ne peut pas être vide")
    @ElementCollection
    private List<Long> produitIds = new ArrayList<>();

    private CommandeStatus status;

    private double total;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Commande() {
        this.createdAt = LocalDateTime.now();
        this.status = CommandeStatus.EN_ATTENTE;
    }

    public Commande(Long clientId, List<Long> produitIds) {
        this.clientId = clientId;
        this.produitIds = produitIds;
        this.createdAt = LocalDateTime.now();
        this.status = CommandeStatus.EN_ATTENTE;
    }

    // Getters et setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public List<Long> getProduitIds() {
        return produitIds;
    }

    public void setProduitIds(List<Long> produitIds) {
        this.produitIds = produitIds;
    }

    public CommandeStatus getStatus() {
        return status;
    }

    public void setStatus(CommandeStatus status) {
        this.status = status;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
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