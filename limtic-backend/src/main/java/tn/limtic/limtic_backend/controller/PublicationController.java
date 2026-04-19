package tn.limtic.limtic_backend.controller;

import org.springframework.web.bind.annotation.*;
import tn.limtic.limtic_backend.model.Publication;
import tn.limtic.limtic_backend.service.PublicationService;
import java.util.List;

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
        return publicationService.save(publication);
    }

    @PutMapping("/{id}")
    public Publication update(@PathVariable Long id, @RequestBody Publication publication) {
        publication.setId(id);
        return publicationService.save(publication);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        publicationService.delete(id);
    }
}