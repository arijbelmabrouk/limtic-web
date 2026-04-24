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

  // Publications en attente
  publicationsEnAttente = computed(() =>
    this.publications().filter(p => p.statut === 'SOUMIS')
  );

  newAxe       = { nom: '', description: '', responsableId: null as number | null };
  newChercheur = { nom: '', prenom: '', grade: '', institution: '', specialite: '' };
  newPub       = { titre: '', type: 'Journal', annee: new Date().getFullYear(), journal: '', resume: '', statut: 'PUBLIE' };
  newEvent     = { titre: '', type: 'Séminaire', dateEvenement: '', lieu: '', description: '' };
  newUser      = { email: '', motDePasse: '', role: 'CHERCHEUR' };
  newDoctorant = {
    nom: '', prenom: '', sujetThese: '',
    directeurId: null as number | null,
    dateInscription: '', statut: 'EN_COURS',
    mention: '', photoUrl: ''
  };
  newMasterien = {
    nom: '', prenom: '', sujetMemoire: '',
    encadrantId: null as number | null,
    promotion: '', statut: 'EN_COURS'
  };

  editingDoctorant = signal<any | null>(null);
  editingMasterien = signal<any | null>(null);

  showForm = signal('');
  message  = signal('');
  erreur   = signal('');

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    const role  = localStorage.getItem('role');
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
    fetch('http://localhost:8080/api/publications', {
      method: 'POST',
      headers: this.api.authHeaders(),
      body: JSON.stringify(this.newPub)
    }).then(() => {
      this.message.set('Publication ajoutée !');
      this.showForm.set('');
      this.newPub = { titre: '', type: 'Journal', annee: new Date().getFullYear(), journal: '', resume: '', statut: 'PUBLIE' };
      this.api.getPublications().subscribe(data => this.publications.set(data));
    });
  }

  validerPublication(id: number) {
    fetch(`http://localhost:8080/api/publications/${id}/statut`, {
      method: 'PATCH',
      headers: this.api.authHeaders(),
      body: JSON.stringify({ statut: 'PUBLIE' })
    }).then(() => {
      this.message.set('Publication validée et publiée !');
      this.api.getPublications().subscribe(data => this.publications.set(data));
    });
  }

  rejeterPublication(id: number) {
    fetch(`http://localhost:8080/api/publications/${id}/statut`, {
      method: 'PATCH',
      headers: this.api.authHeaders(),
      body: JSON.stringify({ statut: 'BROUILLON' })
    }).then(() => {
      this.message.set('Publication renvoyée en brouillon.');
      this.api.getPublications().subscribe(data => this.publications.set(data));
    });
  }

  supprimerPublication(id: number) {
    if (!confirm('Supprimer cette publication ?')) return;
    fetch(`http://localhost:8080/api/publications/${id}`, {
      method: 'DELETE', headers: this.api.authHeaders()
    }).then(() => {
      this.message.set('Publication supprimée.');
      this.api.getPublications().subscribe(data => this.publications.set(data));
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
    fetch('http://localhost:8080/api/evenements', {
      method: 'POST',
      headers: this.api.authHeaders(),
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
    fetch(`http://localhost:8080/api/evenements/${id}`, {
      method: 'DELETE', headers: this.api.authHeaders()
    }).then(() => {
      this.message.set('Événement supprimé.');
      this.api.getEvenements().subscribe(data => this.evenements.set(data));
    });
  }

  // ── Chercheurs ────────────────────────────────────────────
  supprimerChercheur(id: number) {
    if (!confirm('Supprimer ce chercheur ?')) return;
    fetch(`http://localhost:8080/api/chercheurs/${id}`, {
      method: 'DELETE', headers: this.api.authHeaders()
    }).then(() => {
      this.message.set('Chercheur supprimé.');
      this.api.getChercheurs().subscribe(data => this.chercheurs.set(data));
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
    fetch('http://localhost:8080/api/users', {
      method: 'POST',
      headers: this.api.authHeaders(),
      body: JSON.stringify(this.newUser)
    }).then(r => r.json()).then(res => {
      if (res.error) {
        this.message.set(res.error);
      } else {
        this.message.set('Compte créé avec succès !');
        this.showForm.set('');
        this.newUser = { email: '', motDePasse: '', role: 'CHERCHEUR' };
        this.loadUsers();
      }
    });
  }

  changerRole(id: number, event: Event) {
    const role = (event.target as HTMLSelectElement).value;
    fetch(`http://localhost:8080/api/users/${id}/role`, {
      method: 'PATCH', headers: this.api.authHeaders(), body: JSON.stringify({ role })
    }).then(() => { this.message.set('Rôle modifié.'); this.loadUsers(); });
  }

  toggleActif(id: number) {
    fetch(`http://localhost:8080/api/users/${id}/toggle`, {
      method: 'PATCH', headers: this.api.authHeaders()
    }).then(() => { this.message.set('Statut modifié.'); this.loadUsers(); });
  }

  supprimerUser(id: number) {
    if (!confirm('Supprimer ce compte définitivement ?')) return;
    fetch(`http://localhost:8080/api/users/${id}`, {
      method: 'DELETE', headers: this.api.authHeaders()
    }).then(() => { this.message.set('Compte supprimé.'); this.loadUsers(); });
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
    this.api.createAxe(this.newAxe).subscribe(() => {
      this.message.set('Axe créé !');
      this.showForm.set('');
      this.newAxe = { nom: '', description: '', responsableId: null };
      this.loadAxes();
    });
  }

  startEditAxe(axe: any) {
    this.editingAxe.set({ id: axe.id, nom: axe.nom, description: axe.description || '', responsableId: axe.responsable?.id ?? null });
  }

  saveEditAxe() {
    const axe = this.editingAxe();
    if (!axe) return;
    this.api.updateAxe(axe.id, axe).subscribe(() => {
      this.message.set('Axe mis à jour !');
      this.editingAxe.set(null);
      this.loadAxes();
    });
  }

  cancelEditAxe() { this.editingAxe.set(null); }

  supprimerAxe(id: number) {
    if (!confirm("Supprimer cet axe ?")) return;
    this.api.deleteAxe(id).subscribe(() => { this.message.set('Axe supprimé.'); this.loadAxes(); });
  }

  getAssocChercheur(axeId: number): number | null { return this.assocMap()[axeId] ?? null; }

  setAssocChercheur(axeId: number, event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.assocMap.update(m => ({ ...m, [axeId]: val ? +val : null }));
  }

  associerChercheur(axeId: number) {
    const cid = this.getAssocChercheur(axeId);
    if (!cid) return;
    this.api.addChercheurToAxe(axeId, cid).subscribe(() => {
      this.message.set("Chercheur associé à l'axe !");
      this.assocMap.update(m => ({ ...m, [axeId]: null }));
      this.loadAxes();
    });
  }

  retirerChercheur(axeId: number, chercheurId: number) {
    if (!confirm("Retirer ce chercheur de l'axe ?")) return;
    this.api.removeChercheurFromAxe(axeId, chercheurId).subscribe(() => {
      this.message.set('Chercheur retiré.');
      this.loadAxes();
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
    this.api.createDoctorant(this.newDoctorant).subscribe(() => {
      this.message.set('Doctorant ajouté !');
      this.showForm.set('');
      this.newDoctorant = { nom: '', prenom: '', sujetThese: '', directeurId: null, dateInscription: '', statut: 'EN_COURS', mention: '', photoUrl: '' };
      this.loadDoctorants();
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
    this.api.updateDoctorant(d.id, d).subscribe(() => {
      this.message.set('Doctorant mis à jour !');
      this.editingDoctorant.set(null);
      this.loadDoctorants();
    });
  }

  cancelEditDoctorant() { this.editingDoctorant.set(null); }

  supprimerDoctorant(id: number) {
    if (!confirm('Supprimer ce doctorant ?')) return;
    this.api.deleteDoctorant(id).subscribe(() => {
      this.message.set('Doctorant supprimé.');
      this.loadDoctorants();
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
    this.api.createMasterien(this.newMasterien).subscribe(() => {
      this.message.set('Mastérien ajouté !');
      this.showForm.set('');
      this.newMasterien = { nom: '', prenom: '', sujetMemoire: '', encadrantId: null, promotion: '', statut: 'EN_COURS' };
      this.loadMasteriens();
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
    this.api.updateMasterien(m.id, m).subscribe(() => {
      this.message.set('Mastérien mis à jour !');
      this.editingMasterien.set(null);
      this.loadMasteriens();
    });
  }

  cancelEditMasterien() { this.editingMasterien.set(null); }

  supprimerMasterien(id: number) {
    if (!confirm('Supprimer ce mastérien ?')) return;
    this.api.deleteMasterien(id).subscribe(() => {
      this.message.set('Mastérien supprimé.');
      this.loadMasteriens();
    });
  }

  // ── Auth ──────────────────────────────────────────────────
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}