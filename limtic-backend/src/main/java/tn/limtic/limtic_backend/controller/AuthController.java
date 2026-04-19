package tn.limtic.limtic_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.limtic.limtic_backend.model.User;
import tn.limtic.limtic_backend.repository.UserRepository;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        Optional<User> user = userRepository.findByEmail(email);
        
        if (user.isPresent()) {
            return ResponseEntity.ok(Map.of(
                "token", "fake-jwt-" + user.get().getId(),
                "role", user.get().getRole().toString(),
                "email", user.get().getEmail()
            ));
        }
        return ResponseEntity.status(401).body(Map.of("error", "Utilisateur non trouvé"));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(400).body(Map.of("error", "Email déjà utilisé"));
        }
        User user = new User();
        user.setEmail(email);
        user.setMotDePasse(body.get("motDePasse"));
        user.setRole(User.Role.VISITEUR);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Compte créé avec succès"));
    }
}