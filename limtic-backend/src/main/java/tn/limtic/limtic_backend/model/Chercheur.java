package tn.limtic.limtic_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@Table(name = "chercheurs")
public class Chercheur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    private String grade;
    private String institution;
    private String specialite;
    private String photoUrl;
    private String cvUrl;

    @ManyToMany
    @JoinTable(
        name = "chercheur_publication",
        joinColumns = @JoinColumn(name = "chercheur_id"),
        inverseJoinColumns = @JoinColumn(name = "publication_id")
    )
    @JsonIgnoreProperties("chercheurs")
    private List<Publication> publications;

    @ManyToMany
    @JoinTable(
        name = "chercheur_axe",
        joinColumns = @JoinColumn(name = "chercheur_id"),
        inverseJoinColumns = @JoinColumn(name = "axe_id")
    )
    private List<AxeRecherche> axes;
}