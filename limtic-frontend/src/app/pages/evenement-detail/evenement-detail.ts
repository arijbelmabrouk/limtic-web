import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Evenement } from '../../models/chercheur.model';

@Component({
  selector: 'app-evenement-detail',
  imports: [],
  templateUrl: './evenement-detail.html',
  styleUrl: './evenement-detail.css'
})
export class EvenementDetail implements OnInit {
  evenement = signal<Evenement | null>(null);
  isAdmin = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isAdmin = localStorage.getItem('role') === 'ADMIN';

    // Pour l'instant, on charge tous les événements et on filtre
    // TODO: Ajouter une méthode getEvenement(id) dans l'API
    this.api.getEvenements().subscribe((evenements: Evenement[]) => {
      const evt = evenements.find(e => e.id === id);
      if (evt) {
        this.evenement.set(evt);
      } else {
        // Événement non trouvé
        this.router.navigate(['/evenements']);
      }
    });
  }

  retour() {
    this.router.navigate(['/evenements']);
  }

  // Méthodes utilitaires pour l'affichage
  formatDate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDateTime(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}