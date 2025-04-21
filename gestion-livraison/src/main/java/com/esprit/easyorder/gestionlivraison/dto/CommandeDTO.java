package com.esprit.easyorder.gestionlivraison.dto;

import java.util.ArrayList;
import java.util.List;

public class CommandeDTO {
    private Long id;
    private Long clientId;
    private List<Long> produitIds = new ArrayList<>();
    private String status;
    private double total;

    // Constructeurs
    public CommandeDTO() {}

    public CommandeDTO(Long id, Long clientId, List<Long> produitIds, String status, double total) {
        this.id = id;
        this.clientId = clientId;
        this.produitIds = produitIds != null ? produitIds : new ArrayList<>();
        this.status = status;
        this.total = total;
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
        this.produitIds = produitIds != null ? produitIds : new ArrayList<>();
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}