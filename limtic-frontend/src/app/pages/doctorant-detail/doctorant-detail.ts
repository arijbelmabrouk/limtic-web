import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-doctorant-detail',
  imports: [],
  templateUrl: './doctorant-detail.html',
  styleUrl: './doctorant-detail.css'
})
export class DoctorantDetail implements OnInit {
  doctorant = signal<any | null>(null);
  isAdmin = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isAdmin = localStorage.getItem('role') === 'ADMIN';

    // Pour l'instant, on charge tous les doctorants et on filtre
    // TODO: Ajouter une méthode getDoctorant(id) dans l'API
    this.api.getDoctorants().subscribe((doctorants: any[]) => {
      const doc = doctorants.find(d => d.id === id);
      if (doc) {
        this.doctorant.set(doc);
      } else {
        // Doctorant non trouvé
        this.router.navigate(['/doctorants']);
      }
    });
  }

  retour() {
    this.router.navigate(['/doctorants']);
  }

  navigateToChercheur(chercheurId: number) {
    this.router.navigate(['/chercheurs', chercheurId], {
      queryParams: { from: 'doctorant-detail' }
    });
  }

  navigateToAxe(axeId: number) {
    this.router.navigate(['/axes', axeId]);
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
}