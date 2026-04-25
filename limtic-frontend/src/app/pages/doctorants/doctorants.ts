import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-doctorants',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './doctorants.html',
  styleUrl: './doctorants.css'
})
export class Doctorants implements OnInit {
  all      = signal<any[]>([]);
  filtered = signal<any[]>([]);
  loading  = signal(true);

  filterDirecteur = '';
  filterStatut    = '';
  filterAnnee     = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDoctorants().subscribe({
      next: (data) => { this.all.set(data); this.applyFilters(); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  applyFilters() {
    let data = this.all();
    if (this.filterDirecteur)
      data = data.filter(d =>
        d.directeur && `${d.directeur.prenom} ${d.directeur.nom}`
          .toLowerCase().includes(this.filterDirecteur.toLowerCase()));
    if (this.filterStatut)
      data = data.filter(d => d.statut === this.filterStatut);
    if (this.filterAnnee)
      data = data.filter(d =>
        d.dateInscription && d.dateInscription.startsWith(this.filterAnnee));
    this.filtered.set(data);
  }

  resetFilters() {
    this.filterDirecteur = '';
    this.filterStatut    = '';
    this.filterAnnee     = '';
    this.applyFilters();
  }

  getInitials(d: any): string {
    return `${d.prenom?.[0] || ''}${d.nom?.[0] || ''}`.toUpperCase();
  }

  
}