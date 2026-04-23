package tn.limtic.limtic_backend.controller;

import jakarta.mail.internet.MimeMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:4200")
public class ContactController {

    private final JavaMailSender mailSender;

    public ContactController(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }


    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, String> body) {
        String nom     = body.get("nom");
        String email   = body.get("email");
        String sujet   = body.get("sujet");
        String message = body.get("message");

        try {
            MimeMessage mail = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mail, "UTF-8");
            helper.setTo("arij.belmabrouk@etudiant-isi.utm.tn");
            helper.setSubject("[LIMTIC Contact] " + sujet);
            helper.setText("Nouveau message de : " + nom + " <" + email + ">\n\n" + message);
            helper.setReplyTo(email);
            mailSender.send(mail);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Erreur envoi email"));
        }

        return ResponseEntity.ok(Map.of("message", "Message envoyé avec succès"));
    }
}