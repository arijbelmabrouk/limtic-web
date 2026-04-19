import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Chercheur } from '../../models/chercheur.model';

@Component({
  selector: 'app-chercheur-detail',
  imports: [],
  templateUrl: './chercheur-detail.html',
  styleUrl: './chercheur-detail.css'
})
export class ChercheurDetail implements OnInit {
  chercheur = signal<Chercheur | null>(null);

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getChercheur(id).subscribe(data => this.chercheur.set(data));
  }
}