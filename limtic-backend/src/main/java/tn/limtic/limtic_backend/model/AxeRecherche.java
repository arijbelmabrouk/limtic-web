package tn.limtic.limtic_backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "axes_recherche")
public class AxeRecherche {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nom;

    @Column(columnDefinition = "text")
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "responsable_id")
    private Chercheur responsable;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "chercheur_axe",
        joinColumns = @JoinColumn(name = "axe_id"),
        inverseJoinColumns = @JoinColumn(name = "chercheur_id")
    )
    private List<Chercheur> chercheurs = new ArrayList<>();

    // Getters & Setters
    public Long getId() { return id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Chercheur getResponsable() { return responsable; }
    public void setResponsable(Chercheur responsable) { this.responsable = responsable; }
    public List<Chercheur> getChercheurs() { return chercheurs; }
    public void setChercheurs(List<Chercheur> chercheurs) { this.chercheurs = chercheurs; }
}