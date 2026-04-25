package tn.limtic.limtic_backend.controller;

import org.springframework.web.bind.annotation.*;
import tn.limtic.limtic_backend.model.Evenement;
import tn.limtic.limtic_backend.service.EvenementService;
import java.util.List;

@RestController
@RequestMapping("/api/evenements")
@CrossOrigin(origins = {"http://localhost:4200", "https://localhost:4200"}, allowCredentials = "true")
public class EvenementController {

    private final EvenementService evenementService;

    public EvenementController(EvenementService evenementService) {
        this.evenementService = evenementService;
    }

    @GetMapping
    public List<Evenement> getAll() {
        return evenementService.getAll();
    }

    @GetMapping("/{id}")
    public Evenement getById(@PathVariable Long id) {
        return evenementService.getById(id);
    }

    @PostMapping
    public Evenement create(@RequestBody Evenement evenement) {
        return evenementService.save(evenement);
    }

    @PutMapping("/{id}")
    public Evenement update(@PathVariable Long id, @RequestBody Evenement evenement) {
        evenement.setId(id);
        return evenementService.save(evenement);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        evenementService.delete(id);
    }
}