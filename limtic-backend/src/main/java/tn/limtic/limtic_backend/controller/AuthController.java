package tn.limtic.limtic_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import tn.limtic.limtic_backend.config.JwtUtil;
import tn.limtic.limtic_backend.model.PasswordResetToken;
import tn.limtic.limtic_backend.model.User;
import tn.limtic.limtic_backend.repository.PasswordResetTokenRepository;
import tn.limtic.limtic_backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final JavaMailSender mailSender;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil,
                          JavaMailSender mailSender,
                          PasswordResetTokenRepository resetTokenRepository) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.mailSender = mailSender;
        this.resetTokenRepository = resetTokenRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String motDePasse = body.get("motDePasse");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Email introuvable"));
        }

        User user = userOpt.get();
        if (!encoder.matches(motDePasse, user.getMotDePasse())) {
            return ResponseEntity.status(401).body(Map.of("error", "Mot de passe incorrect"));
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString());
        return ResponseEntity.ok(Map.of(
            "token", token,
            "role", user.getRole().toString(),
            "email", user.getEmail()
        ));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(400).body(Map.of("error", "Email déjà utilisé"));
        }
        User user = new User();
        user.setEmail(email);
        user.setMotDePasse(encoder.encode(body.get("motDePasse")));
        user.setRole(User.Role.VISITEUR);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Compte créé avec succès"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "Si cet email existe, un lien a été envoyé."));
        }

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setEmail(email);
        resetToken.setExpiration(LocalDateTime.now().plusHours(1));
        resetTokenRepository.save(resetToken);

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(email);
        mail.setSubject("Réinitialisation de votre mot de passe LIMTIC");
        mail.setText("Cliquez sur ce lien pour réinitialiser votre mot de passe :\n\n"
            + "http://localhost:4200/reset-password?token=" + token
            + "\n\nCe lien expire dans 1 heure.");
        mailSender.send(mail);

        return ResponseEntity.ok(Map.of("message", "Si cet email existe, un lien a été envoyé."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("motDePasse");

        Optional<PasswordResetToken> tokenOpt = resetTokenRepository.findByToken(token);
        if (tokenOpt.isEmpty() || tokenOpt.get().getExpiration().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(400).body(Map.of("error", "Token invalide ou expiré"));
        }

        String email = tokenOpt.get().getEmail();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Utilisateur introuvable"));
        }

        User user = userOpt.get();
        user.setMotDePasse(encoder.encode(newPassword));
        userRepository.save(user);
        resetTokenRepository.delete(tokenOpt.get());

        return ResponseEntity.ok(Map.of("message", "Mot de passe réinitialisé avec succès"));
    }
}