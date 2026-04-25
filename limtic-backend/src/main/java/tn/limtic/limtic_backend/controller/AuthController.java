package tn.limtic.limtic_backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import tn.limtic.limtic_backend.model.PasswordResetToken;
import tn.limtic.limtic_backend.model.User;
import tn.limtic.limtic_backend.repository.PasswordResetTokenRepository;
import tn.limtic.limtic_backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:4200", "https://localhost:4200"}, allowCredentials = "true")
public class AuthController {

    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // On supprime JwtUtil — on n'en a plus besoin
    public AuthController(UserRepository userRepository,
                          JavaMailSender mailSender,
                          PasswordResetTokenRepository resetTokenRepository) {
        this.userRepository = userRepository;
        this.mailSender = mailSender;
        this.resetTokenRepository = resetTokenRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> body,
            HttpServletRequest request,
            HttpServletResponse response) {

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

        // ── Créer la session Spring Security ──────────────────────
        // 1. On crée un objet Authentication avec l'email et le rôle
        UsernamePasswordAuthenticationToken auth =
            new UsernamePasswordAuthenticationToken(
                user.getEmail(),
                null, // pas besoin du mot de passe ici
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().toString()))
            );

        // 2. On met cet objet dans le SecurityContext
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);

        // 3. On sauvegarde le SecurityContext dans la session HTTP
        // Spring va créer automatiquement un cookie LIMTIC_SESSION
        HttpSession session = request.getSession(true);
        session.setAttribute(
            HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
            context
        );

        // On retourne juste le rôle et l'email — plus de token JWT
        return ResponseEntity.ok(Map.of(
            "role", user.getRole().toString(),
            "email", user.getEmail(),
            "message", "Connexion réussie"
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        // Invalider la session côté serveur
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        // Vider le SecurityContext
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "Déconnecté avec succès"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        // Vérifie si l'utilisateur est connecté
        // Spring lit automatiquement la session depuis le cookie
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() ||
            auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).body(Map.of("error", "Non connecté"));
        }
        return ResponseEntity.ok(Map.of(
            "email", auth.getName(),
            "role", auth.getAuthorities().iterator().next()
                       .getAuthority().replace("ROLE_", "")
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
        mail.setText("Cliquez sur ce lien :\n\nhttps://localhost:4200/reset-password?token=" + token
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