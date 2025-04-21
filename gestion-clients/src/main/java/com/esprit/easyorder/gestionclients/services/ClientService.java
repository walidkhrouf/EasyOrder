package com.esprit.easyorder.gestionclients.services;

import com.esprit.easyorder.gestionclients.entities.Client;
import com.esprit.easyorder.gestionclients.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import java.util.List;
import java.util.Optional;

@Service
public class ClientService {
    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SmsService smsService;

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
        Client savedClient = clientRepository.save(client);



        // Send welcome SMS
        try {
            smsService.sendWelcomeSms(savedClient.getTelephone(), savedClient.getNom(), savedClient.getPrenom());
        } catch (Exception e) {
            System.err.println("Failed to send welcome SMS: " + e.getMessage());
        }

        return savedClient;
    }

    public Client updateClient(Long id, Client updatedClient) {
        Client existingClient = getClientById(id);
        existingClient.setNom(updatedClient.getNom());
        existingClient.setPrenom(updatedClient.getPrenom());
        existingClient.setEmail(updatedClient.getEmail());
        existingClient.setAdresse(updatedClient.getAdresse());
        existingClient.setTelephone(updatedClient.getTelephone());
        existingClient.setDateNaissance(updatedClient.getDateNaissance());
        existingClient.setCommandeIds(updatedClient.getCommandeIds());
        return clientRepository.save(existingClient);
    }

    public void deleteClient(Long id) {
        Client client = getClientById(id);
        clientRepository.delete(client);
    }

    public List<Client> searchClientsByName(String nom) {
        if (nom == null || nom.trim().isEmpty()) {
            return clientRepository.findAll();
        }
        return clientRepository.findByNomContainingIgnoreCase(nom);
    }

    public List<Client> searchClientsByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return clientRepository.findAll();
        }
        return clientRepository.findByEmailContainingIgnoreCase(email);
    }

    public List<Client> searchClientsByTelephone(String telephone) {
        if (telephone == null || telephone.trim().isEmpty()) {
            return clientRepository.findAll();
        }
        return clientRepository.findByTelephoneContaining(telephone);
    }
}