package com.esprit.easyorder.gestionclients.services;

import com.esprit.easyorder.gestionclients.entities.Client;
import com.esprit.easyorder.gestionclients.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {
    @Autowired
    private ClientRepository clientRepository;

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Client getClientById(Long id) {
        Optional<Client> client = clientRepository.findById(id);
        if (!client.isPresent()) {
            throw new RuntimeException("Client non trouvé avec l'ID : " + id);
        }
        return client.get();
    }

    public Client saveClient(Client client) {
        return clientRepository.save(client);
    }

    public Client updateClient(Long id, Client updatedClient) {
        Client existingClient = getClientById(id);
        existingClient.setNom(updatedClient.getNom());
        existingClient.setEmail(updatedClient.getEmail());
        existingClient.setCommandeIds(updatedClient.getCommandeIds());
        return clientRepository.save(existingClient);
    }

    public void deleteClient(Long id) {
        Client client = getClientById(id);
        clientRepository.delete(client);
    }
}