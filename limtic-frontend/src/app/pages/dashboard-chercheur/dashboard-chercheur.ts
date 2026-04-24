import { Component, OnInit, signal, computed } from '@angular/core';
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

  newPub = {
    titre: '', type: 'Journal',
    annee: new Date().getFullYear(),
    journal: '', resume: '',
    statut: 'BROUILLON'
  };

  // Stats computed
  pubBrouillons = computed(() => this.publications().filter(p => p.statut === 'BROUILLON' || !p.statut).length);
  pubSoumises   = computed(() => this.publications().filter(p => p.statut === 'SOUMIS').length);
  pubPubliees   = computed(() => this.publications().filter(p => p.statut === 'PUBLIE').length);

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) { this.router.navigate(['/login']); return; }
    this.email.set(localStorage.getItem('email') || '');
    this.role.set(localStorage.getItem('role') || '');
    this.loadProfil();
  }

  loadProfil() {
    const email = this.email();
    fetch('http://localhost:8080/api/chercheurs', {
      headers: this.api.authHeaders()
    })
      .then(r => r.json())
      .then((data: any[]) => {
        const c = data.find(ch => ch.user?.email === email || ch.email === email);
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
          // Charger les publications du chercheur
          this.publications.set(c.publications || []);
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
    if (!this.newPub.titre.trim()) {
      this.message.set('Le titre est obligatoire.');
      return;
    }
    fetch('http://localhost:8080/api/publications', {
      method: 'POST',
      headers: this.api.authHeaders(),
      body: JSON.stringify(this.newPub)
    }).then(() => {
      this.message.set(
        this.newPub.statut === 'SOUMIS'
          ? 'Publication soumise à validation !'
          : 'Publication enregistrée en brouillon !'
      );
      this.activeTab.set('publications');
      this.newPub = { titre: '', type: 'Journal', annee: new Date().getFullYear(), journal: '', resume: '', statut: 'BROUILLON' };
      this.loadProfil();
    });
  }

  soumettre(id: number) {
    fetch(`http://localhost:8080/api/publications/${id}/statut`, {
      method: 'PATCH',
      headers: this.api.authHeaders(),
      body: JSON.stringify({ statut: 'SOUMIS' })
    }).then(() => {
      this.message.set('Publication soumise à validation !');
      this.loadProfil();
    });
  }

  retirerSoumission(id: number) {
    fetch(`http://localhost:8080/api/publications/${id}/statut`, {
      method: 'PATCH',
      headers: this.api.authHeaders(),
      body: JSON.stringify({ statut: 'BROUILLON' })
    }).then(() => {
      this.message.set('Publication remise en brouillon.');
      this.loadProfil();
    });
  }

  getStatutClass(statut: string): string {
    if (statut === 'PUBLIE')    return 'statut-publie';
    if (statut === 'SOUMIS')    return 'statut-soumis';
    return 'statut-brouillon';
  }

  getStatutLabel(statut: string): string {
    if (statut === 'PUBLIE')    return '✅ Publié';
    if (statut === 'SOUMIS')    return '⏳ En attente';
    return '📝 Brouillon';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}