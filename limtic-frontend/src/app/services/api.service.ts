import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {

  // HTTPS maintenant + port 8443
  private base = 'https://localhost:8443/api';

  constructor(private http: HttpClient) {}

  // ── Plus de JWT dans localStorage ─────────────────────────
  // On utilise withCredentials: true pour que le navigateur
  // envoie automatiquement les cookies de session
  private options = {
    withCredentials: true  // ← clé pour envoyer les cookies
  };

  // authHeaders() reste pour compatibilité mais ne met plus de JWT
  authHeaders(): HeadersInit {
    // Le cookie XSRF-TOKEN est lu automatiquement par Angular
    // via HttpClientXsrfModule — pas besoin de le gérer manuellement
    return { 'Content-Type': 'application/json' };
  }

  // ── Auth ───────────────────────────────────────────────────
  login(email: string, motDePasse: string): Observable<any> {
    return this.http.post(`${this.base}/auth/login`,
      { email, motDePasse },
      this.options  // withCredentials pour recevoir le cookie de session
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.base}/auth/logout`, {}, this.options);
  }

  me(): Observable<any> {
    return this.http.get(`${this.base}/auth/me`, this.options);
  }

  // ── Toutes les autres méthodes ajoutent withCredentials ────

  getChercheurs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/chercheurs`, this.options);
  }

  getChercheur(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/chercheurs/${id}`, this.options);
  }

  getPublications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/publications`, this.options);
  }

  getEvenements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/evenements`, this.options);
  }

  getAxes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/axes`, this.options);
  }

  getDoctorants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/doctorants`, this.options);
  }

  getMasteriens(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/masteriens`, this.options);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/users`, this.options);
  }

  getOutils(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/outils`, this.options);
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

  createDoctorant(data: any): Observable<any> {
    return this.http.post(`${this.base}/doctorants`, data, this.options);
  }

  updateDoctorant(id: number, data: any): Observable<any> {
    return this.http.put(`${this.base}/doctorants/${id}`, data, this.options);
  }

  deleteDoctorant(id: number): Observable<any> {
    return this.http.delete(`${this.base}/doctorants/${id}`, this.options);
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

  getAxe(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/axes/${id}`, this.options);
  }

  getPublicationsByAxe(axeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/publications?axeId=${axeId}`, this.options);
  }

  post(endpoint: string, body: any): Observable<any> {
    return this.http.post(`${this.base}/${endpoint}`, body, this.options);
  }

  patch(endpoint: string, body: any): Observable<any> {
    return this.http.patch(`${this.base}/${endpoint}`, body, this.options);
  }

  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.base}/${endpoint}`, this.options);
  }
}