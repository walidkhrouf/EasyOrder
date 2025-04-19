package com.esprit.easyorder.gestionclients.services;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendWelcomeEmail(String to, String nom, String prenom) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject("Bienvenue chez EasyOrder !");
        helper.setText(
                "<h1>Bienvenue, " + prenom + " " + nom + " !</h1>" +
                        "<p>Nous sommes ravis de vous accueillir chez EasyOrder.</p>" +
                        "<p>Votre compte a été créé avec succès. Voici vos informations :</p>" +
                        "<ul>" +
                        "<li>Nom : " + nom + "</li>" +
                        "<li>Prénom : " + prenom + "</li>" +
                        "<li>Email : " + to + "</li>" +
                        "</ul>" +
                        "<p>Merci de nous avoir choisis !</p>" +
                        "<p>L'équipe EasyOrder</p>",
                true
        );

        mailSender.send(message);
    }
}