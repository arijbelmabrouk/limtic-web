import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chercheur, Publication, Evenement, Outil, AxeRecherche } from '../models/chercheur.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // ── Auth headers pour HttpClient ──────────────────────────
  private getHttpHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ── Auth headers pour fetch() ─────────────────────────────
  authHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // ── Chercheurs ─────────────────────────────────────────────
  getChercheurs(): Observable<Chercheur[]> {
    return this.http.get<Chercheur[]>(`${this.base}/chercheurs`);
  }
  getChercheur(id: number): Observable<Chercheur> {
    return this.http.get<Chercheur>(`${this.base}/chercheurs/${id}`);
  }

  // ── Publications ───────────────────────────────────────────
  getPublications(): Observable<Publication[]> {
    return this.http.get<Publication[]>(`${this.base}/publications`);
  }

  // ── Événements ─────────────────────────────────────────────
  getEvenements(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.base}/evenements`);
  }

  // ── Outils ─────────────────────────────────────────────────
  getOutils(): Observable<Outil[]> {
    return this.http.get<Outil[]>(`${this.base}/outils`);
  }

  // ── Users (protégé) ────────────────────────────────────────
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/users`, {
      headers: this.getHttpHeaders()
    });
  }

  // ── Axes de recherche (NOUVEAUX) ───────────────────────────

  /** Liste tous les axes — public */
  getAxes(): Observable<AxeRecherche[]> {
    return this.http.get<AxeRecherche[]>(`${this.base}/axes`);
  }

  /** Un axe par id — public */
  getAxe(id: number): Observable<AxeRecherche> {
    return this.http.get<AxeRecherche>(`${this.base}/axes/${id}`);
  }

  /** Publications d'un axe — public */
  getPublicationsByAxe(axeId: number): Observable<Publication[]> {
    return this.http.get<Publication[]>(`${this.base}/axes/${axeId}/publications`);
  }

  /** Créer un axe — admin */
  createAxe(body: { nom: string; description: string; responsableId: number | null }): Observable<AxeRecherche> {
    return this.http.post<AxeRecherche>(`${this.base}/axes`, body, {
      headers: this.getHttpHeaders()
    });
  }

  /** Modifier un axe — admin */
  updateAxe(id: number, body: any): Observable<AxeRecherche> {
    return this.http.put<AxeRecherche>(`${this.base}/axes/${id}`, body, {
      headers: this.getHttpHeaders()
    });
  }

  /** Supprimer un axe — admin */
  deleteAxe(id: number): Observable<any> {
    return this.http.delete(`${this.base}/axes/${id}`, {
      headers: this.getHttpHeaders()
    });
  }

  /** Ajouter un chercheur à un axe — admin */
  addChercheurToAxe(axeId: number, chercheurId: number): Observable<any> {
    return this.http.post(
      `${this.base}/axes/${axeId}/chercheurs/${chercheurId}`,
      {},
      { headers: this.getHttpHeaders() }
    );
  }

  /** Retirer un chercheur d'un axe — admin */
  removeChercheurFromAxe(axeId: number, chercheurId: number): Observable<any> {
    return this.http.delete(
      `${this.base}/axes/${axeId}/chercheurs/${chercheurId}`,
      { headers: this.getHttpHeaders() }
    );
  }

  getDoctorants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/doctorants`);
  }

  createDoctorant(body: any): Observable<any> {
    return this.http.post(`${this.base}/doctorants`, body, {
      headers: this.getHttpHeaders()
    });
  }

  updateDoctorant(id: number, body: any): Observable<any> {
    return this.http.put(`${this.base}/doctorants/${id}`, body, {
      headers: this.getHttpHeaders()
    });
  }

  deleteDoctorant(id: number): Observable<any> {
    return this.http.delete(`${this.base}/doctorants/${id}`, {
      headers: this.getHttpHeaders()
    });
  }
}