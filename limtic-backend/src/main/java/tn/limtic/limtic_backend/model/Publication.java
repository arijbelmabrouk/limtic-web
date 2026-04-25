package tn.limtic.limtic_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@Table(name = "publications")
public class Publication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(nullable = false)
    private String type;

    private int annee;
    private String journal;
    private String resume;
    private String lienUrl;
    private String doi;
    private String pdfUrl;
    private String motsCles;

    @Column(nullable = false)
    private String statut = "BROUILLON";

    @ManyToOne
    @JoinColumn(name = "axe_id")
    @JsonIgnoreProperties("publications")
    private AxeRecherche axe;

    @ManyToMany(mappedBy = "publications")
    @JsonIgnoreProperties("publications")
    private List<Chercheur> chercheurs;
}