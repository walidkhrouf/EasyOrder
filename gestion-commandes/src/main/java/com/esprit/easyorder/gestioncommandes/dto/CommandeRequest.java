package com.esprit.easyorder.gestioncommandes.dto;

import java.util.List;

public class CommandeRequest {
    private Long clientId;
    private List<Long> produitIds;

    public CommandeRequest() {}

    public CommandeRequest(Long clientId, List<Long> produitIds) {
        this.clientId = clientId;
        this.produitIds = produitIds;
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
}