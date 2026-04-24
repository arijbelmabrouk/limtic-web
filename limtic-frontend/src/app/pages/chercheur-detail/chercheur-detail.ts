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

      // Charger les encadrements filtrés sur ce chercheur
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
    if (from === 'doctorants') {
      this.router.navigate(['/doctorants']);
    } else if (from === 'masteriens') {
      this.router.navigate(['/masteriens']);
    } else {
      this.router.navigate(this.isAdmin ? ['/dashboard-admin'] : ['/chercheurs']);
    }
  }

  getRetourText(): string {
    const from = this.route.snapshot.queryParamMap.get('from');
    if (from === 'doctorants') {
      return 'Retour aux doctorants';
    } else if (from === 'masteriens') {
      return 'Retour aux mastériens';
    } else {
      return this.isAdmin ? 'Retour au dashboard' : 'Retour aux chercheurs';
    }
  }
}