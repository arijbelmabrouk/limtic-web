package tn.limtic.limtic_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import tn.limtic.limtic_backend.config.JwtUtil;
import tn.limtic.limtic_backend.model.User;
import tn.limtic.limtic_backend.repository.UserRepository;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String motDePasse = body.get("motDePasse");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401)
                .body(Map.of("error", "Email introuvable"));
        }

        User user = userOpt.get();

        if (!encoder.matches(motDePasse, user.getMotDePasse())) {
            return ResponseEntity.status(401)
                .body(Map.of("error", "Mot de passe incorrect"));
        }

        String token = jwtUtil.generateToken(
            user.getEmail(),
            user.getRole().toString()
        );

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

    // Endpoint temporaire — à supprimer après l'avoir appelé une seule fois
    @PostMapping("/migrate-passwords")
    public ResponseEntity<?> migratePasswords() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            if (!user.getMotDePasse().startsWith("$2a$")) {
                user.setMotDePasse(encoder.encode(user.getMotDePasse()));
                userRepository.save(user);
            }
        }
        return ResponseEntity.ok(Map.of("message", "Migration terminée"));
    }
}