package com.esprit.easyorder.gestionclients.services;

import com.esprit.easyorder.gestionclients.entities.Client;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StripeService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    public String createStripeCustomer(Client client) throws StripeException {
        Map<String, Object> params = new HashMap<>();
        params.put("name", client.getNom() + " " + client.getPrenom());
        params.put("email", client.getEmail());
        params.put("phone", client.getTelephone());

        Customer customer = Customer.create(params);
        return customer.getId();
    }

    public PaymentIntent createPaymentIntent(String customerId, long amount, String currency)
            throws StripeException {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount)
                .setCurrency(currency.toLowerCase())
                .setCustomer(customerId)
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .build();

        return PaymentIntent.create(params);
    }
}