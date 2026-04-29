package tn.limtic.limtic_backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.limtic.limtic_backend.model.ParametreSysteme;
import tn.limtic.limtic_backend.repository.ParametreSystemeRepository;
import tn.limtic.limtic_backend.service.AuditService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * §4.3.6 CDC — API CRUD pour les paramètres généraux du laboratoire.
 *
 * GET  /api/admin/parametres          → tous les paramètres (masqués pour les sensibles)
 * GET  /api/admin/parametres/public   → paramètres publics (labo, seo, contact) — sans auth
 * GET  /api/admin/parametres/{cle}    → un paramètre par sa clé
 * PUT  /api/admin/parametres/{cle}    → modifier la valeur d'un paramètre
 * POST /api/admin/parametres          → créer un nouveau paramètre
 */
@RestController
@RequestMapping("/api/admin/parametres")
@CrossOrigin(origins = {"http://localhost:4200", "https://localhost:4200"}, allowCredentials = "true")
public class ParametreController {

    private final ParametreSystemeRepository repo;
    private final AuditService auditService;

    public ParametreController(ParametreSystemeRepository repo, AuditService auditService) {
        this.repo = repo;
        this.auditService = auditService;
    }

    /**
     * Paramètres publics lisibles sans authentification.
     * Utilisés par le frontend pour afficher le nom du labo, le logo, la carte Google Maps, etc.
     */
    @GetMapping("/public")
    public List<ParametreSysteme> getPublic() {
        // Retourner uniquement les groupes publics, sans les valeurs sensibles
        List<ParametreSysteme> all = repo.findAll();
        all.forEach(p -> {
            if (p.isSensible()) p.setValeur("***");
        });
        return all.stream()
            .filter(p -> List.of("labo", "seo", "contact", "reseaux", "reseaux_sociaux").contains(p.getGroupe()))
            .toList();
    }

    /** Liste tous les paramètres (admin uniquement) — masque les valeurs sensibles */
    @GetMapping
    public List<ParametreSysteme> getAll() {
        List<ParametreSysteme> all = repo.findAll();
        all.forEach(p -> {
            if (p.isSensible()) p.setValeur("***");
        });
        return all;
    }

    /** Récupère un paramètre par sa clé */
    @GetMapping("/{cle}")
    public ResponseEntity<ParametreSysteme> getByCle(@PathVariable String cle) {
        return repo.findByCle(cle)
            .map(p -> {
                if (p.isSensible()) p.setValeur("***");
                return ResponseEntity.ok(p);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /** Crée un nouveau paramètre */
    @PostMapping
    public ResponseEntity<ParametreSysteme> create(@RequestBody ParametreSysteme parametre,
                                                    HttpServletRequest request) {
        if (repo.findByCle(parametre.getCle()).isPresent()) {
            return ResponseEntity.status(409).build(); // Conflit : clé déjà existante
        }
        ParametreSysteme saved = repo.save(parametre);
        auditService.log(request, "CREATE", "ParametreSysteme", saved.getId(),
            "Paramètre créé : " + saved.getCle(), true);
        return ResponseEntity.ok(saved);
    }

    /**
     * Modifie la valeur d'un paramètre par sa clé.
     * Body : { "valeur": "nouvelle valeur" }
     * Pour les valeurs sensibles, si le body contient "***", on ne modifie pas.
     */
    @PutMapping("/{cle}")
    public ResponseEntity<ParametreSysteme> update(@PathVariable String cle,
                                                    @RequestBody Map<String, String> body,
                                                    HttpServletRequest request) {
        Optional<ParametreSysteme> opt = repo.findByCle(cle);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        ParametreSysteme p = opt.get();
        String nouvelleValeur = body.get("valeur");

        // Ne pas écraser un champ sensible si l'UI renvoie "***"
        if (!"***".equals(nouvelleValeur)) {
            p.setValeur(nouvelleValeur);
        }

        repo.save(p);
        auditService.log(request, "UPDATE", "ParametreSysteme", p.getId(),
            "Paramètre modifié : " + cle, true);

        // Renvoyer sans la valeur si sensible
        if (p.isSensible()) p.setValeur("***");
        return ResponseEntity.ok(p);
    }
}
