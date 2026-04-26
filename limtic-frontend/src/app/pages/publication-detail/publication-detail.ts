import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Publication } from '../../models/chercheur.model';

@Component({
  selector: 'app-publication-detail',
  imports: [CommonModule],
  templateUrl: './publication-detail.html',
  styleUrl: './publication-detail.css'
})
export class PublicationDetail implements OnInit {
  publication = signal<Publication | null>(null);

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.api.getPublications().subscribe((publications: Publication[]) => {
      const pub = publications.find(p => p.id === id);
      if (pub) {
        this.publication.set(pub);
      } else {
        this.router.navigate(['/publications']);
      }
    });
  }

  retour() { this.router.navigate(['/publications']); }

  navigateToChercheur(id: number) {
    this.router.navigate(['/chercheurs', id]);
  }

  navigateToAxe(id: number) {
    this.router.navigate(['/axes', id]);
  }
}
