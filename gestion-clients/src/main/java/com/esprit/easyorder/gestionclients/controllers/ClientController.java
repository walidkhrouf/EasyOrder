package com.esprit.easyorder.gestionclients.controllers;

import com.esprit.easyorder.gestionclients.entities.Client;
import com.esprit.easyorder.gestionclients.services.ClientService;
import com.esprit.easyorder.gestionclients.services.StripeService;
import com.stripe.model.PaymentIntent;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;

import java.util.List;
import java.util.Map;

@Validated
@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @Autowired
    private StripeService stripeService;

    @GetMapping
    public ResponseEntity<List<Client>> getAllClients() {
        List<Client> clients = clientService.getAllClients();
        return new ResponseEntity<>(clients, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable("id") Long id) {
        try {
            Client client = clientService.getClientById(id);
            return new ResponseEntity<>(client, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<Client> createClient(@Valid @RequestBody Client client) {
        Client createdClient = clientService.saveClient(client);
        return new ResponseEntity<>(createdClient, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable("id") Long id, @Valid @RequestBody Client client) {
        try {
            Client updatedClient = clientService.updateClient(id, client);
            return new ResponseEntity<>(updatedClient, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable("id") Long id) {
        try {
            clientService.deleteClient(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{id}/charge")
    public ResponseEntity<?> createPaymentIntent(
            @PathVariable("id") Long id,
            @RequestParam("amount") @Min(1) double amount,
            @RequestParam(value = "currency", defaultValue = "usd") @Size(min = 3, max = 3) String currency) {
        try {
            Client client = clientService.getClientById(id);
            if (client.getStripeCustomerId() == null) {
                String customerId = stripeService.createStripeCustomer(client);
                client.setStripeCustomerId(customerId);
                clientService.updateClient(id, client);
            }
            long amountInCents = (long) (amount * 100);
            PaymentIntent paymentIntent = stripeService.createPaymentIntent(
                    client.getStripeCustomerId(),
                    amountInCents,
                    currency
            );


            Map<String, Object> response = new HashMap<>();
            response.put("clientSecret", paymentIntent.getClientSecret());
            response.put("paymentIntentId", paymentIntent.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "payment_failed");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }


    @GetMapping("/search/by-name")
    public ResponseEntity<List<Client>> searchClientsByName(@RequestParam("nom") String nom) {
        List<Client> clients = clientService.searchClientsByName(nom);
        return new ResponseEntity<>(clients, HttpStatus.OK);
    }

    @GetMapping("/search/by-email")
    public ResponseEntity<List<Client>> searchClientsByEmail(@RequestParam("email") String email) {
        List<Client> clients = clientService.searchClientsByEmail(email);
        return new ResponseEntity<>(clients, HttpStatus.OK);
    }

    @GetMapping("/search/by-telephone")
    public ResponseEntity<List<Client>> searchClientsByTelephone(@RequestParam("telephone") String telephone) {
        List<Client> clients = clientService.searchClientsByTelephone(telephone);
        return new ResponseEntity<>(clients, HttpStatus.OK);
    }
}