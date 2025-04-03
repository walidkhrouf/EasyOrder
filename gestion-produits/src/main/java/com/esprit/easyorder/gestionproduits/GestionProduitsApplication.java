package com.esprit.easyorder.gestionproduits;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;


@EnableDiscoveryClient
@SpringBootApplication
public class GestionProduitsApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionProduitsApplication.class, args);
    }

}
