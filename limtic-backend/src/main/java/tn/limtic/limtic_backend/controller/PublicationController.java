package tn.limtic.limtic_backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.limtic.limtic_backend.model.Publication;
import tn.limtic.limtic_backend.service.AuditService;
import tn.limtic.limtic_backend.service.PublicationService;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.*;

@RestController
@RequestMapping("/api/publications")
@CrossOrigin(origins = {"http://localhost:4200", "https://localhost:4200"}, allowCredentials = "true")
public class PublicationController {

    private final PublicationService publicationService;
    private final AuditService auditService;

    public PublicationController(PublicationService publicationService,
                                  AuditService auditService) {
        this.publicationService = publicationService;
        this.auditService = auditService;
    }

    @GetMapping
    public List<Publication> getAll() {
        return publicationService.getAll();
    }

    @GetMapping("/{id}")
    public Publication getById(@PathVariable Long id) {
        return publicationService.getById(id);
    }

    @GetMapping("/annee/{annee}")
    public List<Publication> getByAnnee(@PathVariable int annee) {
        return publicationService.getByAnnee(annee);
    }

    @GetMapping("/type/{type}")
    public List<Publication> getByType(@PathVariable String type) {
        return publicationService.getByType(type);
    }

    @PostMapping
    public ResponseEntity<Publication> create(@RequestBody Publication publication,
                                               HttpServletRequest request) {
        if (publication.getStatut() == null || publication.getStatut().isEmpty()) {
            publication.setStatut("BROUILLON");
        }
        Publication saved = publicationService.save(publication);
        auditService.log(request, "CREATE", "Publication", saved.getId(),
            "Publication créée : " + saved.getTitre(), true);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Publication> update(@PathVariable Long id,
                                               @RequestBody Publication publication,
                                               HttpServletRequest request) {
        publication.setId(id);
        Publication saved = publicationService.save(publication);
        auditService.log(request, "UPDATE", "Publication", id,
            "Publication modifiée : " + saved.getTitre(), true);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<Publication> updateStatut(@PathVariable Long id,
                                                     @RequestBody Map<String, String> body,
                                                     HttpServletRequest request) {
        Publication updated = publicationService.updateStatut(id, body.get("statut"));
        auditService.log(request, "UPDATE_STATUT", "Publication", id,
            "Statut changé → " + body.get("statut"), true);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, HttpServletRequest request) {
        Publication pub = publicationService.getById(id);
        String titre = pub != null ? pub.getTitre() : "id=" + id;
        publicationService.delete(id);
        auditService.log(request, "DELETE", "Publication", id,
            "Publication supprimée : " + titre, true);
        return ResponseEntity.ok(Map.of("message", "Publication supprimée"));
    }

    @GetMapping("/page")
    public Page<Publication> getPaged(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "annee") String sort,
        @RequestParam(defaultValue = "desc") String dir
    ) {
        Sort.Direction direction = dir.equals("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort));
        return publicationService.getPaged(pageable);
    }
}
