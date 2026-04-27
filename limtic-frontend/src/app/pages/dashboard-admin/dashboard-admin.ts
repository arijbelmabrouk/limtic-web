import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css'
})
export class DashboardAdmin implements OnInit {
  email     = signal('');
  activeTab = signal('dashboard');

  stats = signal({ chercheurs: 0, publications: 0, evenements: 0, outils: 0, axes: 0, users: 0, doctorants: 0, masteriens: 0 });
  chercheurs   = signal<any[]>([]);
  publications = signal<any[]>([]);
  evenements   = signal<any[]>([]);
  users        = signal<any[]>([]);
  doctorants   = signal<any[]>([]);
  masteriens   = signal<any[]>([]);
  axes         = signal<any[]>([]);
  editingAxe   = signal<any | null>(null);
  assocMap     = signal<Record<number, number | null>>({});

  publicationsEnAttente = computed(() =>
    this.publications().filter(p => p.statut === 'SOUMIS')
  );

  newAxe       = { nom: '', description: '', responsableId: null as number | null };
  //newPub       = { titre: '', type: 'Journal', annee: new Date().getFullYear(), journal: '', resume: '', statut: 'PUBLIE',
  newEvent     = { titre: '', type: 'Séminaire', dateEvenement: '', lieu: '', description: '' };
  newUser      = { email: '', motDePasse: '', role: 'CHERCHEUR' };
  newDoctorant = { nom: '', prenom: '', sujetThese: '', directeurId: null as number | null, dateInscription: '', statut: 'EN_COURS', mention: '', photoUrl: '' };
  newMasterien = { nom: '', prenom: '', sujetMemoire: '', encadrantId: null as number | null, promotion: '', statut: 'EN_COURS' };
  newPub = { titre: '', type: 'Journal', annee: new Date().getFullYear(), journal: '', resume: '', statut: 'PUBLIE', doi: '', pdfUrl: '', lienUrl: '', motsCles: ''};
  newPubPdfFile: File | null = null;   // fichier PDF sélectionné avant création
  editingDoctorant = signal<any | null>(null);
  editingMasterien = signal<any | null>(null);

  showForm = signal('');
  message  = signal('');
  erreur   = signal('');

  constructor(private router: Router, private api: ApiService) {}

  private handleError(error: any) {
    const message = error?.error?.message || error?.message || error?.statusText || 'Erreur backend';
    this.message.set('Erreur : ' + message);
  }

  ngOnInit() {
    const role = localStorage.getItem('role');
    if (!role || role !== 'ADMIN') {
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
    this.loadUsers();
    this.loadAxes();
    this.loadDoctorants();
    this.loadMasteriens();
  }

  setTab(tab: string) {
    this.activeTab.set(tab);
    this.showForm.set('');
    this.message.set('');
    this.editingAxe.set(null);
    this.editingDoctorant.set(null);
    this.editingMasterien.set(null);
  }

  // ── Publications ──────────────────────────────────────────
  ajouterPublication() {
    this.api.post('publications', this.newPub).subscribe({
      next: (pub: any) => {
        // Si un PDF a été sélectionné, l'uploader maintenant qu'on a l'ID
        if (this.newPubPdfFile) {
          this.api.uploadPdfPublication(pub.id, this.newPubPdfFile).subscribe({
            next: () => this.api.getPublications().subscribe(data => this.publications.set(data)),
            error: () => this.api.getPublications().subscribe(data => this.publications.set(data))
          });
        } else {
          this.api.getPublications().subscribe(data => this.publications.set(data));
        }
        this.message.set('Publication ajoutée !');
        this.showForm.set('');
        this.newPub = { titre: '', type: 'Journal', annee: new Date().getFullYear(), journal: '', resume: '', statut: 'PUBLIE', doi: '', pdfUrl: '', lienUrl: '', motsCles: ''};
        this.newPubPdfFile = null;
      },
      error: err => this.handleError(err)
    });
  }

  onPdfFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) this.newPubPdfFile = input.files[0];
  }

  validerPublication(id: number) {
    this.api.patch(`publications/${id}/statut`, { statut: 'PUBLIE' }).subscribe({
      next: () => {
        this.message.set('Publication validée !');
        this.api.getPublications().subscribe(data => this.publications.set(data));
      },
      error: err => this.handleError(err)
    });
  }

  rejeterPublication(id: number) {
    this.api.patch(`publications/${id}/statut`, { statut: 'BROUILLON' }).subscribe({
      next: () => {
        this.message.set('Publication renvoyée en brouillon.');
        this.api.getPublications().subscribe(data => this.publications.set(data));
      },
      error: err => this.handleError(err)
    });
  }

  supprimerPublication(id: number) {
    if (!confirm('Supprimer cette publication ?')) return;
    this.api.delete('publications/' + id).subscribe({
      next: () => {
        this.message.set('Publication supprimée.');
        this.api.getPublications().subscribe(data => this.publications.set(data));
      },
      error: err => this.handleError(err)
    });
  }

  getStatutClass(statut: string): string {
    if (statut === 'PUBLIE')    return 'statut-publie';
    if (statut === 'SOUMIS')    return 'statut-soumis';
    if (statut === 'BROUILLON') return 'statut-brouillon';
    return '';
  }

  getStatutLabel(statut: string): string {
    if (statut === 'PUBLIE')    return '✅ Publié';
    if (statut === 'SOUMIS')    return '⏳ Soumis';
    if (statut === 'BROUILLON') return '📝 Brouillon';
    return statut || '-';
  }

  // ── Événements ────────────────────────────────────────────
  ajouterEvenement() {
    this.api.post('evenements', this.newEvent).subscribe({
      next: () => {
        this.message.set('Événement ajouté !');
        this.showForm.set('');
        this.newEvent = { titre: '', type: 'Séminaire', dateEvenement: '', lieu: '', description: '' };
        this.api.getEvenements().subscribe(data => this.evenements.set(data));
      },
      error: err => this.handleError(err)
    });
  }

  supprimerEvenement(id: number) {
    if (!confirm('Supprimer cet événement ?')) return;
    this.api.delete('evenements/' + id).subscribe({
      next: () => {
        this.message.set('Événement supprimé.');
        this.api.getEvenements().subscribe(data => this.evenements.set(data));
      },
      error: err => this.handleError(err)
    });
  }

  // ── Chercheurs ────────────────────────────────────────────
  supprimerChercheur(id: number) {
    if (!confirm('Supprimer ce chercheur ?')) return;
    this.api.delete('chercheurs/' + id).subscribe({
      next: () => {
        this.message.set('Chercheur supprimé.');
        this.api.getChercheurs().subscribe(data => this.chercheurs.set(data));
      },
      error: err => this.handleError(err)
    });
  }

  // ── Comptes ───────────────────────────────────────────────
  loadUsers() {
    this.api.getUsers().subscribe(data => {
      this.users.set(data);
      this.stats.update(s => ({ ...s, users: data.length }));
    });
  }

  creerCompte() {
    if (!this.newUser.email || !this.newUser.motDePasse) {
      this.message.set('Email et mot de passe obligatoires.');
      return;
    }
    this.api.post('users', this.newUser).subscribe({
      next: (res: any) => {
        if (res.error) {
          this.message.set(res.error);
        } else {
          this.message.set('Compte créé avec succès !');
          this.showForm.set('');
          this.newUser = { email: '', motDePasse: '', role: 'CHERCHEUR' };
          this.loadUsers();
        }
      }
    });
  }

  changerRole(id: number, event: Event) {
    const role = (event.target as HTMLSelectElement).value;
    this.api.patch(`users/${id}/role`, { role }).subscribe({
      next: () => {
        this.message.set('Rôle modifié.');
        this.loadUsers();
      },
      error: err => this.handleError(err)
    });
  }

  toggleActif(id: number) {
    this.api.patch(`users/${id}/toggle`, {}).subscribe({
      next: () => {
        this.message.set('Statut modifié.');
        this.loadUsers();
      },
      error: err => this.handleError(err)
    });
  }

  supprimerUser(id: number) {
    if (!confirm('Supprimer ce compte définitivement ?')) return;
    this.api.delete('users/' + id).subscribe({
      next: () => {
        this.message.set('Compte supprimé.');
        this.loadUsers();
      },
      error: err => this.handleError(err)
    });
  }

  // ── Axes ──────────────────────────────────────────────────
  loadAxes() {
    this.api.getAxes().subscribe(data => {
      this.axes.set(data);
      this.stats.update(s => ({ ...s, axes: data.length }));
    });
  }

  ajouterAxe() {
    if (!this.newAxe.nom.trim()) { this.message.set("Le nom de l'axe est obligatoire."); return; }
    this.api.createAxe(this.newAxe).subscribe({
      next: () => {
        this.message.set('Axe créé !');
        this.showForm.set('');
        this.newAxe = { nom: '', description: '', responsableId: null };
        this.loadAxes();
      },
      error: err => this.handleError(err)
    });
  }

  startEditAxe(axe: any) {
    this.editingAxe.set({ id: axe.id, nom: axe.nom, description: axe.description || '', responsableId: axe.responsable?.id ?? null });
  }

  saveEditAxe() {
    const axe = this.editingAxe();
    if (!axe) return;
    this.api.updateAxe(axe.id, axe).subscribe({
      next: () => {
        this.message.set('Axe mis à jour !');
        this.editingAxe.set(null);
        this.loadAxes();
      },
      error: err => this.handleError(err)
    });
  }

  cancelEditAxe() { this.editingAxe.set(null); }

  supprimerAxe(id: number) {
    if (!confirm("Supprimer cet axe ?")) return;
    this.api.deleteAxe(id).subscribe({
      next: () => {
        this.message.set('Axe supprimé.');
        this.loadAxes();
      },
      error: err => this.handleError(err)
    });
  }

  getAssocChercheur(axeId: number): number | null { return this.assocMap()[axeId] ?? null; }

  setAssocChercheur(axeId: number, event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.assocMap.update(m => ({ ...m, [axeId]: val ? +val : null }));
  }

  associerChercheur(axeId: number) {
    const cid = this.getAssocChercheur(axeId);
    if (!cid) return;
    this.api.addChercheurToAxe(axeId, cid).subscribe({
      next: () => {
        this.message.set("Chercheur associé à l'axe !");
        this.assocMap.update(m => ({ ...m, [axeId]: null }));
        this.loadAxes();
      },
      error: err => this.handleError(err)
    });
  }

  retirerChercheur(axeId: number, chercheurId: number) {
    if (!confirm("Retirer ce chercheur de l'axe ?")) return;
    this.api.removeChercheurFromAxe(axeId, chercheurId).subscribe({
      next: () => {
        this.message.set('Chercheur retiré.');
        this.loadAxes();
      },
      error: err => this.handleError(err)
    });
  }

  // ── Doctorants ────────────────────────────────────────────
  loadDoctorants() {
    this.api.getDoctorants().subscribe(data => {
      this.doctorants.set(data);
      this.stats.update(s => ({ ...s, doctorants: data.length }));
    });
  }

  ajouterDoctorant() {
    if (!this.newDoctorant.nom || !this.newDoctorant.prenom) {
      this.message.set('Nom et prénom obligatoires.');
      return;
    }
    this.api.createDoctorant(this.newDoctorant).subscribe({
      next: () => {
        this.message.set('Doctorant ajouté !');
        this.showForm.set('');
        this.newDoctorant = { nom: '', prenom: '', sujetThese: '', directeurId: null, dateInscription: '', statut: 'EN_COURS', mention: '', photoUrl: '' };
        this.loadDoctorants();
      },
      error: err => this.handleError(err)
    });
  }

  startEditDoctorant(d: any) {
    this.editingDoctorant.set({
      id: d.id, nom: d.nom, prenom: d.prenom,
      sujetThese: d.sujetThese || '',
      directeurId: d.directeur?.id ?? null,
      dateInscription: d.dateInscription || '',
      dateSoutenance: d.dateSoutenance || '',
      statut: d.statut || 'EN_COURS',
      mention: d.mention || '',
      photoUrl: d.photoUrl || ''
    });
  }

  saveEditDoctorant() {
    const d = this.editingDoctorant();
    if (!d) return;
    this.api.updateDoctorant(d.id, d).subscribe({
      next: () => {
        this.message.set('Doctorant mis à jour !');
        this.editingDoctorant.set(null);
        this.loadDoctorants();
      },
      error: err => this.handleError(err)
    });
  }

  cancelEditDoctorant() { this.editingDoctorant.set(null); }

  supprimerDoctorant(id: number) {
    if (!confirm('Supprimer ce doctorant ?')) return;
    this.api.deleteDoctorant(id).subscribe({
      next: () => {
        this.message.set('Doctorant supprimé.');
        this.loadDoctorants();
      },
      error: err => this.handleError(err)
    });
  }

  // ── Masteriens ────────────────────────────────────────────
  loadMasteriens() {
    this.api.getMasteriens().subscribe(data => {
      this.masteriens.set(data);
      this.stats.update(s => ({ ...s, masteriens: data.length }));
    });
  }

  ajouterMasterien() {
    if (!this.newMasterien.nom || !this.newMasterien.prenom) {
      this.message.set('Nom et prénom obligatoires.');
      return;
    }
    this.api.createMasterien(this.newMasterien).subscribe({
      next: () => {
        this.message.set('Mastérien ajouté !');
        this.showForm.set('');
        this.newMasterien = { nom: '', prenom: '', sujetMemoire: '', encadrantId: null, promotion: '', statut: 'EN_COURS' };
        this.loadMasteriens();
      },
      error: err => this.handleError(err)
    });
  }

  startEditMasterien(m: any) {
    this.editingMasterien.set({
      id: m.id, nom: m.nom, prenom: m.prenom,
      sujetMemoire: m.sujetMemoire || '',
      encadrantId: m.encadrant?.id ?? null,
      promotion: m.promotion || '',
      statut: m.statut || 'EN_COURS'
    });
  }

  saveEditMasterien() {
    const m = this.editingMasterien();
    if (!m) return;
    this.api.updateMasterien(m.id, m).subscribe({
      next: () => {
        this.message.set('Mastérien mis à jour !');
        this.editingMasterien.set(null);
        this.loadMasteriens();
      },
      error: err => this.handleError(err)
    });
  }

  cancelEditMasterien() { this.editingMasterien.set(null); }

  supprimerMasterien(id: number) {
    if (!confirm('Supprimer ce mastérien ?')) return;
    this.api.deleteMasterien(id).subscribe({
      next: () => {
        this.message.set('Mastérien supprimé.');
        this.loadMasteriens();
      },
      error: err => this.handleError(err)
    });
  }

  // ── Auth ──────────────────────────────────────────────────
  logout() {
    this.api.logout().subscribe({
      next: () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}