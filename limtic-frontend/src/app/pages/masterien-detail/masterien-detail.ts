import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-masterien-detail',
  imports: [],
  templateUrl: './masterien-detail.html',
  styleUrl: './masterien-detail.css'
})
export class MasterienDetail implements OnInit {
  masterien = signal<any | null>(null);
  isAdmin = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isAdmin = localStorage.getItem('role') === 'ADMIN';

    // Pour l'instant, on charge tous les masteriens et on filtre
    // TODO: Ajouter une méthode getMasterien(id) dans l'API
    this.api.getMasteriens().subscribe((masteriens: any[]) => {
      const mst = masteriens.find(m => m.id === id);
      if (mst) {
        this.masterien.set(mst);
      } else {
        // Masterien non trouvé
        this.router.navigate(['/masteriens']);
      }
    });
  }

  retour() {
    this.router.navigate(['/masteriens']);
  }

  navigateToChercheur(chercheurId: number) {
    this.router.navigate(['/chercheurs', chercheurId], {
      queryParams: { from: 'masterien-detail' }
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