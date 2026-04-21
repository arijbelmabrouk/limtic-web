package tn.limtic.limtic_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "axes_recherche")
public class AxeRecherche {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    private String description;

    @JsonIgnore
    @ManyToMany(mappedBy = "axes")
    private List<Chercheur> chercheurs;
}