import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chercheur, Publication, Evenement, Outil } from '../models/chercheur.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

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
}