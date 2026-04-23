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

  chercheurId = signal<number | null>(null);

  profil = signal<any>({});
  editProfil = {
    grade: '', specialite: '', institution: '',
    bureau: '', telephone: '', biographie: '',
    googleScholar: '', researchGate: '', orcid: '', linkedin: ''
  };

  newPub = { titre: '', type: 'Journal', annee: new Date().getFullYear(), journal: '', resume: '' };

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) { this.router.navigate(['/login']); return; }
    this.email.set(localStorage.getItem('email') || '');
    this.role.set(localStorage.getItem('role') || '');
    this.api.getPublications().subscribe(data => this.publications.set(data));
    this.loadProfil();
  }

  loadProfil() {
    const email = this.email();
    fetch('http://localhost:8080/api/chercheurs', {
      headers: this.api.authHeaders()
    })
      .then(r => r.json())
      .then((data: any[]) => {
        const c = data.find(ch =>
          ch.user?.email === email || ch.email === email
        );
        if (c) {
          this.chercheurId.set(c.id);
          this.profil.set(c);
          this.editProfil = {
            grade:         c.grade         || '',
            specialite:    c.specialite    || '',
            institution:   c.institution   || '',
            bureau:        c.bureau        || '',
            telephone:     c.telephone     || '',
            biographie:    c.biographie    || '',
            googleScholar: c.googleScholar || '',
            researchGate:  c.researchGate  || '',
            orcid:         c.orcid         || '',
            linkedin:      c.linkedin      || ''
          };
        }
      });
  }

  sauvegarderProfil() {
    const id = this.chercheurId();
    if (!id) { this.message.set('Profil introuvable.'); return; }
    fetch(`http://localhost:8080/api/chercheurs/${id}/profil`, {
      method: 'PATCH',
      headers: this.api.authHeaders(),
      body: JSON.stringify(this.editProfil)
    }).then(() => {
      this.message.set('Profil mis à jour avec succès !');
      this.loadProfil();
    });
  }

  ajouterPublication() {
    fetch('http://localhost:8080/api/publications', {
      method: 'POST',
      headers: this.api.authHeaders(),
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