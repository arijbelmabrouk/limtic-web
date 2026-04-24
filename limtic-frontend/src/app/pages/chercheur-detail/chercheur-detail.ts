import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Chercheur } from '../../models/chercheur.model';

@Component({
  selector: 'app-chercheur-detail',
  imports: [],
  templateUrl: './chercheur-detail.html',
  styleUrl: './chercheur-detail.css'
})
export class ChercheurDetail implements OnInit {
  chercheur  = signal<Chercheur | null>(null);
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

    this.api.getChercheur(id).subscribe(data => {
      this.chercheur.set(data);

      this.api.getDoctorants().subscribe((list: any[]) => {
        this.doctorants.set(list.filter(d => d.directeur?.id === id));
      });
      this.api.getMasteriens().subscribe((list: any[]) => {
        this.masteriens.set(list.filter(m => m.encadrant?.id === id));
      });
    });
  }

  retour() {
    const from = this.route.snapshot.queryParamMap.get('from');
    if (from === 'doctorant-detail') this.router.navigate(['/doctorants']);
    else if (from === 'masterien-detail') this.router.navigate(['/masteriens']);
    else this.router.navigate(this.isAdmin ? ['/dashboard-admin'] : ['/chercheurs']);
  }

  getRetourText(): string {
    const from = this.route.snapshot.queryParamMap.get('from');
    if (from === 'doctorant-detail') return 'Retour aux doctorants';
    if (from === 'masterien-detail') return 'Retour aux mastériens';
    return this.isAdmin ? 'Retour au dashboard' : 'Retour aux chercheurs';
  }

  navigateToPublication(id: number) {
    this.router.navigate(['/publications', id]);
  }

  navigateToDoctorant(id: number) {
    this.router.navigate(['/doctorants', id]);
  }

  navigateToMasterien(id: number) {
    this.router.navigate(['/masteriens', id]);
  }
}