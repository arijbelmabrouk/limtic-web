import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chercheur, Publication, Evenement, Outil } from '../models/chercheur.model';

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

  // ── GET publics ───────────────────────────────────────────
  getChercheurs(): Observable<Chercheur[]> {
    return this.http.get<Chercheur[]>(`${this.base}/chercheurs`);
  }

  getChercheur(id: number): Observable<Chercheur> {
    return this.http.get<Chercheur>(`${this.base}/chercheurs/${id}`);
  }

  getPublications(): Observable<Publication[]> {
    return this.http.get<Publication[]>(`${this.base}/publications`);
  }

  getEvenements(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.base}/evenements`);
  }

  getOutils(): Observable<Outil[]> {
    return this.http.get<Outil[]>(`${this.base}/outils`);
  }

  // ── GET protégés ──────────────────────────────────────────
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/users`, {
      headers: this.getHttpHeaders()
    });
  }
}