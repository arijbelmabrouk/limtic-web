import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard-admin',
  imports: [FormsModule, RouterLink],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css'
})
export class DashboardAdmin implements OnInit {
  email = signal('');
  activeTab = signal('dashboard');

  stats = signal({ chercheurs: 0, publications: 0, evenements: 0, outils: 0 });

  chercheurs = signal<any[]>([]);
  publications = signal<any[]>([]);
  evenements = signal<any[]>([]);

  showForm = signal('');
  message = signal('');
  erreur = signal('');

  newChercheur = { nom: '', prenom: '', grade: '', institution: '', specialite: '' };
  newPub = { titre: '', type: 'Journal', annee: new Date().getFullYear(), journal: '', resume: '' };
  newEvent = { titre: '', type: 'Séminaire', dateEvenement: '', lieu: '', description: '' };

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'ADMIN') {
      this.router.navigate(['/login']);
      return;
    }
    this.email.set(localStorage.getItem('email') || '');
    this.loadAll();
  }

  loadAll() {
    this.api.getChercheurs().subscribe(data => {
      this.chercheurs.set(data);
      this.stats.update(s => ({ ...s, chercheurs: data.length }));
    });
    this.api.getPublications().subscribe(data => {
      this.publications.set(data);
      this.stats.update(s => ({ ...s, publications: data.length }));
    });
    this.api.getEvenements().subscribe(data => {
      this.evenements.set(data);
      this.stats.update(s => ({ ...s, evenements: data.length }));
    });
  }

  setTab(tab: string) {
    this.activeTab.set(tab);
    this.showForm.set('');
    this.message.set('');
  }

  ajouterPublication() {
    fetch('http://localhost:8080/api/publications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.newPub)
    }).then(() => {
      this.message.set('Publication ajoutée !');
      this.showForm.set('');
      this.newPub = { titre: '', type: 'Journal', annee: new Date().getFullYear(), journal: '', resume: '' };
      this.api.getPublications().subscribe(data => this.publications.set(data));
    });
  }

  supprimerPublication(id: number) {
    if (!confirm('Supprimer cette publication ?')) return;
    fetch(`http://localhost:8080/api/publications/${id}`, { method: 'DELETE' })
      .then(() => {
        this.message.set('Publication supprimée.');
        this.api.getPublications().subscribe(data => this.publications.set(data));
      });
  }

  ajouterEvenement() {
    fetch('http://localhost:8080/api/evenements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.newEvent)
    }).then(() => {
      this.message.set('Événement ajouté !');
      this.showForm.set('');
      this.newEvent = { titre: '', type: 'Séminaire', dateEvenement: '', lieu: '', description: '' };
      this.api.getEvenements().subscribe(data => this.evenements.set(data));
    });
  }

  supprimerEvenement(id: number) {
    if (!confirm('Supprimer cet événement ?')) return;
    fetch(`http://localhost:8080/api/evenements/${id}`, { method: 'DELETE' })
      .then(() => {
        this.message.set('Événement supprimé.');
        this.api.getEvenements().subscribe(data => this.evenements.set(data));
      });
  }

  supprimerChercheur(id: number) {
    if (!confirm('Supprimer ce chercheur ?')) return;
    fetch(`http://localhost:8080/api/chercheurs/${id}`, { method: 'DELETE' })
      .then(() => {
        this.message.set('Chercheur supprimé.');
        this.api.getChercheurs().subscribe(data => this.chercheurs.set(data));
      });
  }

  logout() {
  localStorage.clear();
  this.router.navigate(['/login']);
}
}