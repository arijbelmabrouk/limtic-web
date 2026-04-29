import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';
import { ThemeService } from '../../services/theme.service';
import { SafePipe } from '../../pipes/Safepipe';
import { AdminEvenementsComponent } from '../admin-evenements/admin-evenements.component';

// ── Types internes pour §4.3.6 ────────────────────────────────────────────────

/** Valeurs du formulaire "Identité du laboratoire" */
interface LaboForm {
  nom:        string;
  acronyme:   string;
  description: string;
  email:      string;
  telephone:  string;
  adresse:    string;
}

/** Valeurs du formulaire "Couleurs du thème" */
interface ThemeForm {
  couleurPrimaire:  string;   // --accent
  couleurSecondaire: string;  // --accent-hover
  couleurDanger:    string;   // --danger
  couleurSucces:    string;   // --success
  couleurWarning:   string;   // --warning
}

// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminEvenementsComponent],
  templateUrl: './dashboard-admin.html',
  styleUrls: ['./dashboard-admin.css']
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
  newEvent     = { titre: '', type: 'Séminaire', dateEvenement: '', lieu: '', description: '' };
  newUser      = { email: '', motDePasse: '', role: 'CHERCHEUR' };
  newDoctorant = { nom: '', prenom: '', sujetThese: '', directeurId: null as number | null, dateInscription: '', statut: 'EN_COURS', mention: '', photoUrl: '' };
  newMasterien = { nom: '', prenom: '', sujetMemoire: '', encadrantId: null as number | null, promotion: '', statut: 'EN_COURS' };
  newPub: {
    titre: string; type: string; annee: number; journal: string; resume: string;
    statut: string; doi: string; pdfUrl: string; lienUrl: string; motsCles: string;
    scimagoQuartile: string; classementCORE: string;
    facteurImpact: number | null; snip: number | null;
    sourceClassement: string;
  } = {
    titre: '', type: 'Journal', annee: new Date().getFullYear(), journal: '',
    resume: '', statut: 'PUBLIE', doi: '', pdfUrl: '', lienUrl: '', motsCles: '',
    scimagoQuartile: '', classementCORE: '',
    facteurImpact: null, snip: null, sourceClassement: ''
  };
  newPubPdfFile: File | null = null;
  newPubPdfPreviewUrl: SafeResourceUrl | null = null;
  editingDoctorant    = signal<any | null>(null);
  editingMasterien    = signal<any | null>(null);
  editingPublication  = signal<any | null>(null);

  editPubPdfFile: File | null = null;
  editPubPdfPreviewUrl: SafeResourceUrl | null = null;
  private _editPdfBlobUrl: string | null = null;
  get editPdfBlobUrl(): string | null { return this._editPdfBlobUrl; }
  editPdfViewerUrl = signal<SafeResourceUrl | null>(null);
  editRemovePdf = false;
  private _editExistingPdfSafeUrl: SafeResourceUrl | null = null;
  private _editExistingPdfBlobUrl: string | null = null;
  get editExistingPdfBlobUrl(): string | null { return this._editExistingPdfBlobUrl; }

  showForm = signal('');
  message  = signal('');
  erreur   = signal('');

  csvFile = signal<File | null>(null);
  csvImportReport = signal<{ importes: number; ignores: number; erreurs: string[] } | null>(null);

  // ── §4.3.6 — Paramètres généraux ────────────────────────────────────────

  /** Formulaire identité labo */
  laboForm: LaboForm = {
    nom:         '',
    acronyme:    '',
    description: '',
    email:       '',
    telephone:   '',
    adresse:     '',
  };

  /** Formulaire couleurs du thème */
  themeForm: ThemeForm = {
    couleurPrimaire:   '#00d2ff',
    couleurSecondaire: '#00a8cc',
    couleurDanger:     '#f87171',
    couleurSucces:     '#34d399',
    couleurWarning:    '#f59e0b',
  };

  /** URL courante du logo (relative, ex: /uploads/logos/logo-abc.png) */
  logoUrlCourante = signal<string>('');

  /** Prévisualisation locale du logo avant upload */
  logoPreviewUrl = signal<string>('');

  /** Fichier logo sélectionné en attente d'upload */
  private logoFile: File | null = null;

  /** Indicateur de sauvegarde en cours */
  parametresSaving = signal(false);

  /** Indicateur de chargement initial des paramètres */
  parametresLoading = signal(false);

  // ─────────────────────────────────────────────────────────────────────────

  constructor(
    private router: Router,
    private api: ApiService,
    private sanitizer: DomSanitizer,
    public themeService: ThemeService
  ) {}

  private handleError(error: any) {
    const message = error?.error?.message || error?.message || error?.statusText || 'Erreur backend';
    this.message.set('');
    this.erreur.set('Erreur : ' + message);
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
    this.erreur.set('');
    this.csvFile.set(null);
    this.csvImportReport.set(null);
    this.editingAxe.set(null);
    this.editingDoctorant.set(null);
    this.editingMasterien.set(null);
    this.editingPublication.set(null);

    // Charger les paramètres quand on arrive sur l'onglet
    if (tab === 'parametres') {
      this.loadParametres();
    }
  }

  // ── Publications ──────────────────────────────────────────────────────────

  ajouterPublication() {
    this.api.post('publications', this.newPub).subscribe({
      next: (pub: any) => {
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
        this.newPub = {
          titre: '', type: 'Journal', annee: new Date().getFullYear(), journal: '',
          resume: '', statut: 'PUBLIE', doi: '', pdfUrl: '', lienUrl: '', motsCles: '',
          scimagoQuartile: '', classementCORE: '', facteurImpact: null, snip: null, sourceClassement: ''
        };
        this.clearPdfSelection();
      },
      error: err => this.handleError(err)
    });
  }

  private _pdfBlobUrl: string | null = null;
  get pdfBlobUrl(): string | null { return this._pdfBlobUrl; }

  onPdfFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      if (this._pdfBlobUrl) URL.revokeObjectURL(this._pdfBlobUrl);
      this.newPubPdfFile = input.files[0];
      this._pdfBlobUrl = URL.createObjectURL(this.newPubPdfFile);
      this.newPubPdfPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this._pdfBlobUrl);
    }
  }

  clearPdfSelection() {
    if (this._pdfBlobUrl) {
      URL.revokeObjectURL(this._pdfBlobUrl);
      this._pdfBlobUrl = null;
    }
    this.newPubPdfPreviewUrl = null;
    this.newPubPdfFile = null;
  }

  // ── Édition de publication ────────────────────────────────────────────────

  startEditPublication(p: any) {
    this.editingPublication.set({
      id: p.id,
      titre: p.titre || '',
      type: p.type || 'Journal',
      annee: p.annee || new Date().getFullYear(),
      journal: p.journal || '',
      resume: p.resume || '',
      doi: p.doi || '',
      lienUrl: p.lienUrl || '',
      motsCles: p.motsCles || '',
      statut: p.statut || 'BROUILLON',
      scimagoQuartile: p.scimagoQuartile ?? null,
      classementCORE: p.classementCORE ?? null,
      facteurImpact: p.facteurImpact ?? null,
      snip: p.snip ?? null,
      sourceClassement: p.sourceClassement || '',
      pdfUrl: p.pdfUrl || null
    });
    this.clearEditPdfSelection();
    this.editRemovePdf = false;
    this._editExistingPdfSafeUrl = null;
    if (this._editExistingPdfBlobUrl) {
      URL.revokeObjectURL(this._editExistingPdfBlobUrl);
      this._editExistingPdfBlobUrl = null;
    }
    this.editPdfViewerUrl.set(null);
    if (p.pdfUrl) {
      this.loadEditExistingPdf();
    }
    this.showForm.set('');
  }

  saveEditPublication() {
    const p = this.editingPublication();
    if (!p) return;
    if (!p.titre?.trim()) { this.message.set('Le titre est obligatoire.'); return; }

    if (this.editRemovePdf && !this.editPubPdfFile) {
      this.api.deletePdfPublication(p.id).subscribe({ next: () => {}, error: () => {} });
      p.pdfUrl = null;
    }

    const payload = {
      ...p,
      scimagoQuartile: p.scimagoQuartile || null,
      classementCORE:  p.classementCORE  || null,
      facteurImpact:   p.facteurImpact   ?? null,
      snip:            p.snip            ?? null,
    };

    this.api.updatePublication(p.id, payload).subscribe({
      next: () => {
        if (this.editPubPdfFile) {
          this.api.uploadPdfPublication(p.id, this.editPubPdfFile).subscribe({
            next: () => {
              this.message.set('Publication mise à jour avec le nouveau PDF !');
              this.clearEditPdfSelection();
              this.editingPublication.set(null);
              this.api.getPublications().subscribe(data => this.publications.set(data));
            },
            error: () => {
              this.message.set('Publication mise à jour, mais erreur lors de l\'upload PDF.');
              this.clearEditPdfSelection();
              this.editingPublication.set(null);
              this.api.getPublications().subscribe(data => this.publications.set(data));
            }
          });
        } else {
          this.message.set('Publication mise à jour !');
          this.editingPublication.set(null);
          this.api.getPublications().subscribe(data => this.publications.set(data));
        }
      },
      error: err => this.handleError(err)
    });
  }

  cancelEditPublication() {
    this.clearEditPdfSelection();
    this.editRemovePdf = false;
    this._editExistingPdfSafeUrl = null;
    if (this._editExistingPdfBlobUrl) {
      URL.revokeObjectURL(this._editExistingPdfBlobUrl);
      this._editExistingPdfBlobUrl = null;
    }
    this.editPdfViewerUrl.set(null);
    this.editingPublication.set(null);
  }

  onEditPdfFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    if (this._editPdfBlobUrl) URL.revokeObjectURL(this._editPdfBlobUrl);
    this.editPubPdfFile = input.files[0];
    this._editPdfBlobUrl = URL.createObjectURL(this.editPubPdfFile);
    this.editPubPdfPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this._editPdfBlobUrl);
    this.editPdfViewerUrl.set(this.editPubPdfPreviewUrl);
    this.editRemovePdf = false;
  }

  clearEditPdfSelection() {
    if (this._editPdfBlobUrl) {
      URL.revokeObjectURL(this._editPdfBlobUrl);
      this._editPdfBlobUrl = null;
    }
    this.editPubPdfPreviewUrl = null;
    this.editPubPdfFile = null;
    if (!this.editRemovePdf) {
      this.loadEditExistingPdf();
    } else {
      this.editPdfViewerUrl.set(null);
    }
  }

  markRemoveEditPdf() {
    this.editRemovePdf = true;
    this.clearEditPdfSelection();
    this._editExistingPdfSafeUrl = null;
    if (this._editExistingPdfBlobUrl) {
      URL.revokeObjectURL(this._editExistingPdfBlobUrl);
      this._editExistingPdfBlobUrl = null;
    }
    this.editPdfViewerUrl.set(null);
  }

  undoRemoveEditPdf() {
    this.editRemovePdf = false;
    this.loadEditExistingPdf();
  }

  getFullPdfUrl(relativePath: string): string {
    return this.api.getUploadUrl(relativePath);
  }

  getEditExistingPdfUrl(): SafeResourceUrl {
    const p = this.editingPublication();
    if (!p?.pdfUrl) return this.sanitizer.bypassSecurityTrustResourceUrl('');
    if (!this._editExistingPdfSafeUrl) {
      this._editExistingPdfSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
      this.api.getPdfBlob(p.pdfUrl).subscribe({
        next: (blob) => {
          if (this._editExistingPdfBlobUrl) URL.revokeObjectURL(this._editExistingPdfBlobUrl);
          this._editExistingPdfBlobUrl = URL.createObjectURL(blob);
          this._editExistingPdfSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this._editExistingPdfBlobUrl);
        },
        error: () => {
          this._editExistingPdfSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
        }
      });
    }
    return this._editExistingPdfSafeUrl;
  }

  getEditPdfViewerUrl(): SafeResourceUrl | null {
    return this.editPdfViewerUrl();
  }

  private loadEditExistingPdf() {
    const p = this.editingPublication();
    if (!p?.pdfUrl || this.editRemovePdf || this.editPubPdfFile) return;
    this.api.getPdfBlob(p.pdfUrl).subscribe({
      next: (blob) => {
        if (this._editExistingPdfBlobUrl) URL.revokeObjectURL(this._editExistingPdfBlobUrl);
        const pdfBlob = blob.type ? blob : new Blob([blob], { type: 'application/pdf' });
        this._editExistingPdfBlobUrl = URL.createObjectURL(pdfBlob);
        this._editExistingPdfSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this._editExistingPdfBlobUrl);
        this.editPdfViewerUrl.set(this._editExistingPdfSafeUrl);
      },
      error: () => {
        this._editExistingPdfSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
        this.editPdfViewerUrl.set(null);
      }
    });
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

  // ── Événements ────────────────────────────────────────────────────────────

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

  // ── Chercheurs ────────────────────────────────────────────────────────────

  exportChercheursCsv() {
    this.message.set('Téléchargement du CSV en cours...');
    this.erreur.set('');
    this.api.exportChercheursCsv();
  }

  onCsvFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.csvFile.set(file);
    this.csvImportReport.set(null);
    this.message.set('');
    this.erreur.set('');
    if (input) input.value = '';
  }

  importChercheursCsv() {
    const file = this.csvFile();
    if (!file) {
      this.erreur.set('Veuillez sélectionner un fichier CSV.');
      return;
    }
    this.api.importChercheursCsv(file).subscribe({
      next: (res: any) => {
        this.csvImportReport.set({
          importes: res.importes ?? 0,
          ignores: res.ignores ?? 0,
          erreurs: res.erreurs ?? []
        });
        this.message.set(res.message || 'Import CSV terminé.');
        this.erreur.set('');
        this.csvFile.set(null);
        this.api.getChercheurs().subscribe(data => {
          this.chercheurs.set(data);
          this.stats.update(s => ({ ...s, chercheurs: data.length }));
        });
      },
      error: err => this.handleError(err)
    });
  }

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

  // ── Comptes ───────────────────────────────────────────────────────────────

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

  // ── Axes ──────────────────────────────────────────────────────────────────

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

  // ── Doctorants ────────────────────────────────────────────────────────────

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

  // ── Mastériens ────────────────────────────────────────────────────────────

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

  fermerTout() {
    this.showForm.set('');
    this.message.set('');
    this.erreur.set('');
    this.editingAxe.set(null);
    this.editingDoctorant.set(null);
    this.editingMasterien.set(null);
    this.editingPublication.set(null);
  }

  // ── §4.3.6 — Paramètres généraux ─────────────────────────────────────────

  /**
   * Charge tous les paramètres depuis le backend et remplit les formulaires.
   * Appelé automatiquement à l'arrivée sur l'onglet "Paramètres".
   */
  loadParametres() {
    this.parametresLoading.set(true);
    this.api.getParametres().subscribe({
      next: (params: any[]) => {
        // Construire un dictionnaire cle → valeur pour un accès facile
        const map: Record<string, string> = {};
        params.forEach(p => { map[p.cle] = p.valeur ?? ''; });

        // Peupler le formulaire labo
        this.laboForm = {
          nom:         map['labo.nom']         ?? '',
          acronyme:    map['labo.acronyme']     ?? '',
          description: map['labo.description']  ?? '',
          email:       map['labo.email']        ?? '',
          telephone:   map['labo.telephone']    ?? '',
          adresse:     map['labo.adresse']      ?? '',
        };

        // Peupler le formulaire thème (garder les valeurs par défaut si absent)
        this.themeForm = {
          couleurPrimaire:   map['theme.couleurPrimaire']   ?? '#00d2ff',
          couleurSecondaire: map['theme.couleurSecondaire'] ?? '#00a8cc',
          couleurDanger:     map['theme.couleurDanger']     ?? '#f87171',
          couleurSucces:     map['theme.couleurSucces']     ?? '#34d399',
          couleurWarning:    map['theme.couleurWarning']    ?? '#f59e0b',
        };

        // Logo existant
        const logoUrl = map['labo.logoUrl'] ?? '';
        this.logoUrlCourante.set(logoUrl);
        // Ne pas écraser la preview locale si l'admin a déjà sélectionné un fichier
        if (!this.logoFile) {
          this.logoPreviewUrl.set(logoUrl ? this.api.getLogoUrl(logoUrl) : '');
        }

        // Appliquer les couleurs en prévisualisation immédiate
        this.appliquerCouleursTheme(this.themeForm);

        this.parametresLoading.set(false);
      },
      error: err => {
        this.parametresLoading.set(false);
        this.handleError(err);
      }
    });
  }

  /**
   * Appelé à chaque changement d'un color picker pour prévisualiser
   * les nouvelles couleurs en temps réel sans sauvegarder.
   */
  onCouleurChange() {
    this.appliquerCouleursTheme(this.themeForm);
  }

  /**
   * Applique les couleurs du formulaire comme variables CSS sur :root
   * afin que tout le dashboard reflète les changements en direct.
   */
  private appliquerCouleursTheme(theme: ThemeForm) {
    const root = document.documentElement;
    root.style.setProperty('--accent',          theme.couleurPrimaire);
    root.style.setProperty('--accent-hover',    theme.couleurSecondaire);
    root.style.setProperty('--danger',          theme.couleurDanger);
    root.style.setProperty('--success',         theme.couleurSucces);
    root.style.setProperty('--warning',         theme.couleurWarning);
    // Variantes soft (alpha 10%)
    root.style.setProperty('--accent-soft',     theme.couleurPrimaire + '1a');
    root.style.setProperty('--danger-soft',     theme.couleurDanger   + '1f');
    root.style.setProperty('--success-soft',    theme.couleurSucces   + '1a');
    root.style.setProperty('--warning-soft',    theme.couleurWarning  + '1a');
  }

  /**
   * Réinitialise les couleurs aux valeurs par défaut du thème dark.
   */
  reinitialiserCouleurs() {
    this.themeForm = {
      couleurPrimaire:   '#00d2ff',
      couleurSecondaire: '#00a8cc',
      couleurDanger:     '#f87171',
      couleurSucces:     '#34d399',
      couleurWarning:    '#f59e0b',
    };
    this.appliquerCouleursTheme(this.themeForm);
  }

  /**
   * Gère la sélection d'un fichier logo depuis l'input file.
   * Génère immédiatement une prévisualisation locale (blob URL).
   */
  onLogoFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    // Valider côté client (type + taille) avant même d'envoyer
    if (!file.type.startsWith('image/')) {
      this.erreur.set('Seules les images sont acceptées (PNG, JPEG, SVG, WebP).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.erreur.set('Le logo ne doit pas dépasser 2 Mo.');
      return;
    }

    this.logoFile = file;
    this.erreur.set('');

    // Prévisualisation locale immédiate
    const reader = new FileReader();
    reader.onload = (e) => {
      this.logoPreviewUrl.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  /**
   * Annule la sélection en cours et revient au logo sauvegardé.
   */
  annulerLogoSelection() {
    this.logoFile = null;
    const urlCourante = this.logoUrlCourante();
    this.logoPreviewUrl.set(urlCourante ? this.api.getLogoUrl(urlCourante) : '');
  }

  /**
   * Sauvegarde les paramètres labo + thème en une seule opération.
   * Si un nouveau logo a été sélectionné, il est uploadé en premier.
   */
  sauvegarderParametres() {
    this.parametresSaving.set(true);
    this.message.set('');
    this.erreur.set('');

    if (this.logoFile) {
      // 1. Uploader le logo, puis sauvegarder le reste
      this.api.uploadLogo(this.logoFile).subscribe({
        next: (res) => {
          this.logoUrlCourante.set(res.logoUrl);
          this.logoFile = null;
          this.sauvegarderParamsTexte();
        },
        error: err => {
          this.parametresSaving.set(false);
          this.handleError(err);
        }
      });
    } else {
      // Pas de nouveau logo — sauvegarder directement
      this.sauvegarderParamsTexte();
    }
  }

  /**
   * Envoi en lot de tous les paramètres texte (labo + thème) vers le backend.
   */
  private sauvegarderParamsTexte() {
    const payload: Record<string, string> = {
      // Identité labo
      'labo.nom':         this.laboForm.nom,
      'labo.acronyme':    this.laboForm.acronyme,
      'labo.description': this.laboForm.description,
      'labo.email':       this.laboForm.email,
      'labo.telephone':   this.laboForm.telephone,
      'labo.adresse':     this.laboForm.adresse,
      // Couleurs du thème
      'theme.couleurPrimaire':   this.themeForm.couleurPrimaire,
      'theme.couleurSecondaire': this.themeForm.couleurSecondaire,
      'theme.couleurDanger':     this.themeForm.couleurDanger,
      'theme.couleurSucces':     this.themeForm.couleurSucces,
      'theme.couleurWarning':    this.themeForm.couleurWarning,
    };

    this.api.updateParametresLot(payload).subscribe({
      next: () => {
        this.parametresSaving.set(false);
        this.message.set('Paramètres sauvegardés avec succès !');
      },
      error: err => {
        this.parametresSaving.set(false);
        this.handleError(err);
      }
    });
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

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