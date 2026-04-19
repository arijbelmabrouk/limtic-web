package tn.limtic.limtic_backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "masteriens")
public class Masterien {

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

    private String sujetMemoire;

    @ManyToOne
    @JoinColumn(name = "encadrant_id")
    private Chercheur encadrant;
}