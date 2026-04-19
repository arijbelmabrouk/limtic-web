package tn.limtic.limtic_backend.controller;

import org.springframework.web.bind.annotation.*;
import tn.limtic.limtic_backend.model.Chercheur;
import tn.limtic.limtic_backend.service.ChercheurService;
import java.util.List;

@RestController
@RequestMapping("/api/chercheurs")
@CrossOrigin(origins = "http://localhost:4200")
public class ChercheurController {

    private final ChercheurService chercheurService;

    public ChercheurController(ChercheurService chercheurService) {
        this.chercheurService = chercheurService;
    }

    @GetMapping
    public List<Chercheur> getAll() {
        return chercheurService.getAll();
    }

    @GetMapping("/{id}")
    public Chercheur getById(@PathVariable Long id) {
        return chercheurService.getById(id);
    }

    @PostMapping
    public Chercheur create(@RequestBody Chercheur chercheur) {
        return chercheurService.save(chercheur);
    }

    @PutMapping("/{id}")
    public Chercheur update(@PathVariable Long id, @RequestBody Chercheur chercheur) {
        chercheur.setId(id);
        return chercheurService.save(chercheur);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        chercheurService.delete(id);
    }
}