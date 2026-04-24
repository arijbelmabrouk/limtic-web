package tn.limtic.limtic_backend.controller;

import org.springframework.web.bind.annotation.*;
import tn.limtic.limtic_backend.model.Publication;
import tn.limtic.limtic_backend.service.PublicationService;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.*;

@RestController
@RequestMapping("/api/publications")
@CrossOrigin(origins = "http://localhost:4200")
public class PublicationController {

    private final PublicationService publicationService;

    public PublicationController(PublicationService publicationService) {
        this.publicationService = publicationService;
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
    public Publication create(@RequestBody Publication publication) {
        if (publication.getStatut() == null || publication.getStatut().isEmpty()) {
            publication.setStatut("BROUILLON");
        }
        return publicationService.save(publication);
    }

    @PutMapping("/{id}")
    public Publication update(@PathVariable Long id, @RequestBody Publication publication) {
        publication.setId(id);
        return publicationService.save(publication);
    }

    
    @PatchMapping("/{id}/statut")
    public Publication updateStatut(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return publicationService.updateStatut(id, body.get("statut"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        publicationService.delete(id);
    }

    @GetMapping("/page")
    public Page<Publication> getPaged(
        @RequestParam(defaultValue = "0")  int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "annee") String sort,
        @RequestParam(defaultValue = "desc") String dir
    ) {
        Sort.Direction direction = dir.equals("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort));
        return publicationService.getPaged(pageable);
    }
}