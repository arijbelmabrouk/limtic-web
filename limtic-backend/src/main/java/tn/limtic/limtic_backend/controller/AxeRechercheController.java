package tn.limtic.limtic_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.limtic.limtic_backend.model.AxeRecherche;
import tn.limtic.limtic_backend.model.Chercheur;
import tn.limtic.limtic_backend.repository.AxeRechercheRepository;
import tn.limtic.limtic_backend.repository.ChercheurRepository;
import tn.limtic.limtic_backend.repository.PublicationRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/axes")
@CrossOrigin(origins = "http://localhost:4200")
public class AxeRechercheController {

    private final AxeRechercheRepository axeRepo;
    private final ChercheurRepository chercheurRepo;
    private final PublicationRepository publicationRepo;

    public AxeRechercheController(AxeRechercheRepository axeRepo,
                                   ChercheurRepository chercheurRepo,
                                   PublicationRepository publicationRepo) {
        this.axeRepo = axeRepo;
        this.chercheurRepo = chercheurRepo;
        this.publicationRepo = publicationRepo;
    }

    // ── PUBLIC ──────────────────────────────────────────────
    @GetMapping
    public List<AxeRecherche> getAll() {
        return axeRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return axeRepo.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/publications")
    public ResponseEntity<?> getPublications(@PathVariable Long id) {
        if (!axeRepo.existsById(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(publicationRepo.findByAxeId(id));
    }

    // ── ADMIN ────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        AxeRecherche axe = new AxeRecherche();
        axe.setNom((String) body.get("nom"));
        axe.setDescription((String) body.get("description"));
        if (body.get("responsableId") != null) {
            Long rid = Long.valueOf(body.get("responsableId").toString());
            chercheurRepo.findById(rid).ifPresent(axe::setResponsable);
        }
        return ResponseEntity.ok(axeRepo.save(axe));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                     @RequestBody Map<String, Object> body) {
        Optional<AxeRecherche> opt = axeRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        AxeRecherche axe = opt.get();
        if (body.get("nom") != null) axe.setNom((String) body.get("nom"));
        if (body.get("description") != null) axe.setDescription((String) body.get("description"));
        if (body.get("responsableId") != null) {
            Long rid = Long.valueOf(body.get("responsableId").toString());
            chercheurRepo.findById(rid).ifPresent(axe::setResponsable);
        }
        return ResponseEntity.ok(axeRepo.save(axe));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!axeRepo.existsById(id)) return ResponseEntity.notFound().build();
        axeRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Axe supprimé"));
    }

    @PutMapping("/{id}/chercheurs")
    public ResponseEntity<?> updateChercheurs(@PathVariable Long id,
                                               @RequestBody List<Long> chercheurIds) {
        Optional<AxeRecherche> opt = axeRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        List<Chercheur> chercheurs = chercheurRepo.findAllById(chercheurIds);
        AxeRecherche axe = opt.get();
        axe.setChercheurs(chercheurs);
        return ResponseEntity.ok(axeRepo.save(axe));
    }
}