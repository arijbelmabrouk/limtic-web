import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AxeRecherche, Chercheur, Publication } from '../../models/chercheur.model';

@Component({
  selector: 'app-axe-detail',
  imports: [],
  templateUrl: './axe-detail.html',
  styleUrl: './axe-detail.css'
})
export class AxeDetail implements OnInit {
  axe = signal<AxeRecherche | null>(null);
  chercheurs = signal<Chercheur[]>([]);
  publications = signal<Publication[]>([]);
  doctorants = signal<any[]>([]);
  masteriens = signal<any[]>([]);
  isAdmin = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isAdmin = localStorage.getItem('role') === 'ADMIN';

    // Charger l'axe
    this.api.getAxe(id).subscribe(data => {
      this.axe.set(data);

      // Charger les chercheurs associés
      this.api.getChercheurs().subscribe((chercheurs: Chercheur[]) => {
        this.chercheurs.set(chercheurs.filter(c => c.axes?.some((a: any) => a.id === id)));
      });

      // Charger les publications de cet axe
      this.api.getPublicationsByAxe(id).subscribe((publications: Publication[]) => {
        this.publications.set(publications);
      });

      // Charger doctorants et masteriens associés à cet axe
      this.api.getDoctorants().subscribe((doctorants: any[]) => {
        this.doctorants.set(doctorants.filter(d => d.axeRecherche?.id === id));
      });

      this.api.getMasteriens().subscribe((masteriens: any[]) => {
        this.masteriens.set(masteriens.filter(m => m.axeRecherche?.id === id));
      });
    });
  }

  retour() {
    this.router.navigate(['/axes']);
  }

  navigateToChercheur(chercheurId: number) {
    this.router.navigate(['/chercheurs', chercheurId], {
      queryParams: { from: 'axe-detail' }
    });
  }

  navigateToPublication(publicationId: number) {
    this.router.navigate(['/publications', publicationId]);
  }
}