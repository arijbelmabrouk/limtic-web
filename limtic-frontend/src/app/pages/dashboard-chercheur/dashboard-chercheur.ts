import { Component, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Publication } from '../../models/chercheur.model';

@Component({
  selector: 'app-dashboard-chercheur',
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard-chercheur.html',
  styleUrl: './dashboard-chercheur.css'
})
export class DashboardChercheur implements OnInit {
  email        = signal('');
  role         = signal('');
  activeTab    = signal('publications');
  encTab       = signal('doctorants'); // Onglet actif pour ajouter des encadrements
  publications = signal<Publication[]>([]);
  message      = signal('');
  chercheurId  = signal<number | null>(null);
  profil       = signal<any>({});

  // ── Encadrements ────────────────────────────────────────
  mesDoctorants    = signal<any[]>([]);
  mesMasteriens    = signal<any[]>([]);
  doctorantsDispos = signal<any[]>([]);
  masteriensDispos = signal<any[]>([]);
  encMsg           = signal('');

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

  pubBrouillons = computed(() => this.publications().filter(p => p.statut === 'BROUILLON' || !p.statut).length);
  pubSoumises   = computed(() => this.publications().filter(p => p.statut === 'SOUMIS').length);
  pubPubliees   = computed(() => this.publications().filter(p => p.statut === 'PUBLIE').length);

  constructor(private router: Router, private api: ApiService) {}

  private handleError(error: any) {
    const message = error?.error?.message || error?.message || error?.statusText || 'Erreur backend';
    this.message.set('Erreur : ' + message);
  }

  ngOnInit() {
    this.email.set(localStorage.getItem('email') || '');
    this.role.set(localStorage.getItem('role') || '');
    this.loadProfil();
  }

  viewPublication(id: number) {
    this.router.navigate(['/publications', id]);
  }

  loadProfil() {
    const email = this.email();
    this.api.getChercheurs().subscribe((data: any[]) => {
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
        this.publications.set(c.publications || []);
        this.chargerEncadrements(c.id);
      }
    });
  }

  chargerEncadrements(cid: number) {
    this.api.getDoctorants().subscribe((data: any[]) => {
      this.mesDoctorants.set(data.filter(d => d.directeur?.id === cid));
      this.doctorantsDispos.set(data.filter(d => !d.directeur));
    });
    this.api.getMasteriens().subscribe((data: any[]) => {
      this.mesMasteriens.set(data.filter(m => m.encadrant?.id === cid));
      this.masteriensDispos.set(data.filter(m => !m.encadrant));
    });
  }

  assignerDoctorant(doctorantId: number) {
    const cid = this.chercheurId();
    if (!cid) return;
    this.api.updateDoctorant(doctorantId, { directeurId: cid }).subscribe({
      next: () => {
        this.encMsg.set('Doctorant assigné avec succès !');
        this.chargerEncadrements(cid);
        setTimeout(() => this.encMsg.set(''), 3000);
      },
      error: err => this.handleError(err)
    });
  }

  retirerDoctorant(doctorantId: number) {
    const cid = this.chercheurId();
    if (!cid) return;
    this.api.updateDoctorant(doctorantId, { directeurId: null }).subscribe({
      next: () => {
        this.encMsg.set('Doctorant retiré.');
        this.chargerEncadrements(cid);
        setTimeout(() => this.encMsg.set(''), 3000);
      },
      error: err => this.handleError(err)
    });
  }

  assignerMasterien(masterienId: number) {
    const cid = this.chercheurId();
    if (!cid) return;
    this.api.updateMasterien(masterienId, { encadrantId: cid }).subscribe({
      next: () => {
        this.encMsg.set('Mastérien assigné avec succès !');
        this.chargerEncadrements(cid);
        setTimeout(() => this.encMsg.set(''), 3000);
      },
      error: err => this.handleError(err)
    });
  }

  retirerMasterien(masterienId: number) {
    const cid = this.chercheurId();
    if (!cid) return;
    this.api.updateMasterien(masterienId, { encadrantId: null }).subscribe({
      next: () => {
        this.encMsg.set('Mastérien retiré.');
        this.chargerEncadrements(cid);
        setTimeout(() => this.encMsg.set(''), 3000);
      },
      error: err => this.handleError(err)
    });
  }

  sauvegarderProfil() {
    const id = this.chercheurId();
    if (!id) { this.message.set('Profil introuvable.'); return; }
    this.api.patch(`chercheurs/${id}/profil`, this.editProfil).subscribe({
      next: () => {
        this.message.set('Profil mis à jour avec succès !');
        this.loadProfil();
      },
      error: err => this.handleError(err)
    });
  }

  ajouterPublication() {
    if (!this.newPub.titre.trim()) {
      this.message.set('Le titre est obligatoire.');
      return;
    }
    this.api.post('publications', this.newPub).subscribe({
      next: () => {
        this.message.set(
          this.newPub.statut === 'SOUMIS'
            ? 'Publication soumise à validation !'
            : 'Publication enregistrée en brouillon !'
        );
        this.activeTab.set('publications');
        this.newPub = { titre: '', type: 'Journal', annee: new Date().getFullYear(), journal: '', resume: '', statut: 'BROUILLON' };
        this.loadProfil();
      },
      error: err => this.handleError(err)
    });
  }

  soumettre(id: number) {
    this.api.patch(`publications/${id}/statut`, { statut: 'SOUMIS' }).subscribe({
      next: () => {
        this.message.set('Publication soumise à validation !');
        this.loadProfil();
      },
      error: err => this.handleError(err)
    });
  }

  retirerSoumission(id: number) {
    this.api.patch(`publications/${id}/statut`, { statut: 'BROUILLON' }).subscribe({
      next: () => {
        this.message.set('Publication remise en brouillon.');
        this.loadProfil();
      },
      error: err => this.handleError(err)
    });
  }

  getStatutClass(statut: string): string {
    if (statut === 'PUBLIE') return 'statut-publie';
    if (statut === 'SOUMIS') return 'statut-soumis';
    return 'statut-brouillon';
  }

  getStatutLabel(statut: string): string {
    if (statut === 'PUBLIE') return '✅ Publié';
    if (statut === 'SOUMIS') return '⏳ En attente';
    return '📝 Brouillon';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
