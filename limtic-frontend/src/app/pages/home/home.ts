import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);

  statsLoading = signal(true);
  statsChercheurs = signal(0);
  statsPublications = signal(0);
  statsEvenements = signal(0);
  statsOutils = signal(0);

  ngOnInit() {
    this.api.getChercheurs().subscribe({
      next: (data) => this.statsChercheurs.set(data?.length || 0),
      error: () => this.statsChercheurs.set(0)
    });

    this.api.getPublications().subscribe({
      next: (data) => this.statsPublications.set(data?.length || 0),
      error: () => this.statsPublications.set(0)
    });

    this.api.getEvenements().subscribe({
      next: (data) => this.statsEvenements.set(data?.length || 0),
      error: () => this.statsEvenements.set(0)
    });

    this.api.getOutils().subscribe({
      next: (data) => {
        this.statsOutils.set(data?.length || 0);
        this.statsLoading.set(false);
      },
      error: () => {
        this.statsOutils.set(0);
        this.statsLoading.set(false);
      }
    });
  }
}
