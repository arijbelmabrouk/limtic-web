import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Evenement } from '../../models/chercheur.model';

@Component({
  selector: 'app-evenement-detail',
  imports: [CommonModule],
  templateUrl: './evenement-detail.html',
  styleUrl: './evenement-detail.css'
})
export class EvenementDetail implements OnInit {
  evenement = signal<Evenement | null>(null);

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.api.getEvenements().subscribe((evenements: Evenement[]) => {
      const evt = evenements.find(e => e.id === id);
      if (evt) {
        this.evenement.set(evt);
      } else {
        this.router.navigate(['/evenements']);
      }
    });
  }

  retour() { this.router.navigate(['/evenements']); }

  formatDate(date: string | Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  getDay(date: string | Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit' });
  }

  getMonth(date: string | Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase();
  }

  getYear(date: string | Date): string {
    if (!date) return '';
    return new Date(date).getFullYear().toString();
  }
}