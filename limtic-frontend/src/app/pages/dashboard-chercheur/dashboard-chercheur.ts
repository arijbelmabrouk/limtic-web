import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Publication } from '../../models/chercheur.model';

@Component({
  selector: 'app-dashboard-chercheur',
  imports: [FormsModule],
  templateUrl: './dashboard-chercheur.html',
  styleUrl: './dashboard-chercheur.css'
})
export class DashboardChercheur implements OnInit {
  email = signal('');
  role = signal('');
  activeTab = signal('publications');
  publications = signal<Publication[]>([]);
  message = signal('');

  newPub = { titre: '', type: 'Journal', annee: new Date().getFullYear(), journal: '', resume: '' };

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) { this.router.navigate(['/login']); return; }
    this.email.set(localStorage.getItem('email') || '');
    this.role.set(localStorage.getItem('role') || '');
    this.api.getPublications().subscribe(data => this.publications.set(data));
  }

  ajouterPublication() {
    fetch('http://localhost:8080/api/publications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.newPub)
    }).then(() => {
      this.message.set('Publication ajoutée avec succès !');
      this.activeTab.set('publications');
      this.newPub = { titre: '', type: 'Journal', annee: new Date().getFullYear(), journal: '', resume: '' };
      this.api.getPublications().subscribe(data => this.publications.set(data));
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}