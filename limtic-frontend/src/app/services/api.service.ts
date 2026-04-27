import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private base = 'https://localhost:8443/api';

  private options = { withCredentials: true };

  constructor(private http: HttpClient) {}

  // ── Auth ──────────────────────────────────────────────────────────────────
  login(email: string, motDePasse: string): Observable<any> {
    return this.http.post(`${this.base}/auth/login`, { email, motDePasse }, this.options);
  }
  logout(): Observable<any> {
    return this.http.post(`${this.base}/auth/logout`, {}, this.options);
  }
  me(): Observable<any> {
    return this.http.get(`${this.base}/auth/me`, this.options);
  }

  // ── Chercheurs ────────────────────────────────────────────────────────────
  getChercheurs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/chercheurs`, this.options);
  }
  getChercheur(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/chercheurs/${id}`, this.options);
  }
  createChercheur(data: any): Observable<any> {
    return this.http.post(`${this.base}/chercheurs`, data, this.options);
  }
  updateChercheur(id: number, data: any): Observable<any> {
    return this.http.put(`${this.base}/chercheurs/${id}`, data, this.options);
  }
  deleteChercheur(id: number): Observable<any> {
    return this.http.delete(`${this.base}/chercheurs/${id}`, this.options);
  }

  // ── Import/Export CSV membres (§4.3.2) ───────────────────────────────────
  exportChercheursCsv(): void {
    // Ouvre l'URL dans un nouvel onglet — le navigateur déclenche le téléchargement
    window.open(`${this.base}/admin/chercheurs/export-csv`, '_blank');
  }
  importChercheursCsv(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.base}/admin/chercheurs/import-csv`, formData, {
      withCredentials: true
      // PAS de Content-Type : le navigateur le définit automatiquement avec le boundary
    });
  }

  // ── Publications ──────────────────────────────────────────────────────────
  getPublications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/publications`, this.options);
  }
  getPublicationsByAxe(axeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/publications?axe=${axeId}`, this.options);
  }
  getPublication(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/publications/${id}`, this.options);
  }
  createPublication(data: any): Observable<any> {
    return this.http.post(`${this.base}/publications`, data, this.options);
  }
  updatePublication(id: number, data: any): Observable<any> {
    return this.http.put(`${this.base}/publications/${id}`, data, this.options);
  }
  updatePublicationStatut(id: number, statut: string): Observable<any> {
    return this.http.patch(`${this.base}/publications/${id}/statut`, { statut }, this.options);
  }
  deletePublication(id: number): Observable<any> {
    return this.http.delete(`${this.base}/publications/${id}`, this.options);
  }

  /** §3.7.2 CDC — Upload PDF pour une publication */
  uploadPdfPublication(publicationId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(
      `${this.base}/publications/${publicationId}/upload-pdf`,
      formData,
      { withCredentials: true }
    );
  }

  // ── Événements ────────────────────────────────────────────────────────────
  getEvenements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/evenements`, this.options);
  }
  getEvenement(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/evenements/${id}`, this.options);
  }
  createEvenement(data: any): Observable<any> {
    return this.http.post(`${this.base}/evenements`, data, this.options);
  }
  updateEvenement(id: number, data: any): Observable<any> {
    return this.http.put(`${this.base}/evenements/${id}`, data, this.options);
  }
  deleteEvenement(id: number): Observable<any> {
    return this.http.delete(`${this.base}/evenements/${id}`, this.options);
  }

  /** Upload multiple photos pour un événement (drag-drop) */
  uploadPhotosEvenement(evenementId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    return this.http.post(
      `${this.base}/evenements/${evenementId}/photos`,
      formData,
      { withCredentials: true }
    );
  }

  /** Supprime une photo d'un événement */
  deletePhotoEvenement(evenementId: number, photoId: number): Observable<any> {
    return this.http.delete(
      `${this.base}/evenements/${evenementId}/photos/${photoId}`,
      this.options
    );
  }

  /** Met à jour l'ordre des photos (drag-drop) */
  updateOrdrePhotos(evenementId: number, ordres: {id: number, ordre: number}[]): Observable<any> {
    return this.http.patch(
      `${this.base}/evenements/${evenementId}/photos/ordre`,
      ordres,
      this.options
    );
  }

  // ── Axes de recherche ─────────────────────────────────────────────────────
  getAxes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/axes`, this.options);
  }
  getAxe(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/axes/${id}`, this.options);
  }
  createAxe(data: any): Observable<any> {
    return this.http.post(`${this.base}/axes`, data, this.options);
  }
  updateAxe(id: number, data: any): Observable<any> {
    return this.http.put(`${this.base}/axes/${id}`, data, this.options);
  }
  deleteAxe(id: number): Observable<any> {
    return this.http.delete(`${this.base}/axes/${id}`, this.options);
  }
  addChercheurToAxe(axeId: number, chercheurId: number): Observable<any> {
    return this.http.post(`${this.base}/axes/${axeId}/chercheurs/${chercheurId}`, {}, this.options);
  }
  removeChercheurFromAxe(axeId: number, chercheurId: number): Observable<any> {
    return this.http.delete(`${this.base}/axes/${axeId}/chercheurs/${chercheurId}`, this.options);
  }

  // ── Doctorants / Mastériens ───────────────────────────────────────────────
  getDoctorants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/doctorants`, this.options);
  }
  createDoctorant(data: any): Observable<any> {
    return this.http.post(`${this.base}/doctorants`, data, this.options);
  }
  updateDoctorant(id: number, data: any): Observable<any> {
    return this.http.put(`${this.base}/doctorants/${id}`, data, this.options);
  }
  deleteDoctorant(id: number): Observable<any> {
    return this.http.delete(`${this.base}/doctorants/${id}`, this.options);
  }

  getMasteriens(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/masteriens`, this.options);
  }
  createMasterien(data: any): Observable<any> {
    return this.http.post(`${this.base}/masteriens`, data, this.options);
  }
  updateMasterien(id: number, data: any): Observable<any> {
    return this.http.put(`${this.base}/masteriens/${id}`, data, this.options);
  }
  deleteMasterien(id: number): Observable<any> {
    return this.http.delete(`${this.base}/masteriens/${id}`, this.options);
  }

  // ── Outils ────────────────────────────────────────────────────────────────
  getOutils(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/outils`, this.options);
  }

  // ── Users ─────────────────────────────────────────────────────────────────
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/users`, this.options);
  }

  // ── Paramètres système (§4.3.6) ───────────────────────────────────────────
  getParametresPublics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/admin/parametres/public`, this.options);
  }
  getParametres(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/admin/parametres`, this.options);
  }
  updateParametre(cle: string, valeur: string): Observable<any> {
    return this.http.put(`${this.base}/admin/parametres/${cle}`, { valeur }, this.options);
  }

  // ── Journal d'audit (§4.1) ────────────────────────────────────────────────
  getAuditLog(page = 0, size = 50): Observable<any> {
    return this.http.get(
      `${this.base}/admin/audit?page=${page}&size=${size}`,
      this.options
    );
  }

  // ── Actualités (fil dynamique pour la home) ───────────────────────────────
  /**
   * Retourne les N dernières publications publiées
   */
  getDernieresPublications(n = 5): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.base}/publications?statut=PUBLIE&sort=annee,desc&size=${n}`,
      this.options
    );
  }

  /**
   * Retourne les prochains événements (dateEvenement >= aujourd'hui)
   */
  getProchainsEvenements(n = 3): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.base}/evenements?upcoming=true&size=${n}`,
      this.options
    );
  }

  // ── Contact (avec captcha) ────────────────────────────────────────────────
  envoyerContact(data: {
    nom: string;
    email: string;
    sujet: string;
    message: string;
    captchaToken: string;
  }): Observable<any> {
    return this.http.post(`${this.base}/contact`, data, this.options);
  }

  // ── Helpers génériques (compatibilité ancien code) ────────────────────────
  post(endpoint: string, body: any): Observable<any> {
    return this.http.post(`${this.base}/${endpoint}`, body, this.options);
  }
  patch(endpoint: string, body: any): Observable<any> {
    return this.http.patch(`${this.base}/${endpoint}`, body, this.options);
  }
  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.base}/${endpoint}`, this.options);
  }

  // ══════════════════════════════════════════════════════════════════
// AJOUTS à faire dans api.service.ts
// ══════════════════════════════════════════════════════════════════

// 1. Ajouter getDoctorant(id) — pour charger un doctorant par ID
getDoctorant(id: number): Observable<any> {
  return this.http.get<any>(`${this.base}/doctorants/${id}`, this.options);
}

// 2. Ajouter getChercheursByStatut — pour filtre actif/retraité
getChercheursByStatut(statut: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.base}/chercheurs?statut=${statut}`, this.options);
}

// 3. Ajouter exportPublicationsCsv — export côté backend (optionnel)
exportPublicationsCsv(): void {
  window.open(`${this.base}/publications/export-csv`, '_blank');
}
}