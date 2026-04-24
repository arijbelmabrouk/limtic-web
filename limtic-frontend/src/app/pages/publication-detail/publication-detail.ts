import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Publication } from '../../models/chercheur.model';

@Component({
  selector: 'app-publication-detail',
  imports: [],
  templateUrl: './publication-detail.html',
  styleUrl: './publication-detail.css'
})
export class PublicationDetail implements OnInit {
  publication = signal<Publication | null>(null);
  isAdmin = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isAdmin = localStorage.getItem('role') === 'ADMIN';

    // Pour l'instant, on charge toutes les publications et on filtre
    // TODO: Ajouter une méthode getPublication(id) dans l'API
    this.api.getPublications().subscribe((publications: Publication[]) => {
      const pub = publications.find(p => p.id === id);
      if (pub) {
        this.publication.set(pub);
      } else {
        // Publication non trouvée
        this.router.navigate(['/publications']);
      }
    });
  }

  retour() {
    this.router.navigate(['/publications']);
  }

  // Méthodes utilitaires pour l'affichage
  formatDate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getAuthorsString(publication: Publication): string {
    if (!publication.chercheur) return 'Auteur inconnu';
    return `${publication.chercheur.prenom} ${publication.chercheur.nom}`;
  }
}