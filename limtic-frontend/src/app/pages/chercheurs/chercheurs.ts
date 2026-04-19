import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Chercheur } from '../../models/chercheur.model';

@Component({
  selector: 'app-chercheurs',
  imports: [RouterLink],
  templateUrl: './chercheurs.html',
  styleUrl: './chercheurs.css'
})
export class Chercheurs implements OnInit {
  chercheurs = signal<Chercheur[]>([]);

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getChercheurs().subscribe({
      next: (data) => {
        console.log('DATA:', data);
        this.chercheurs.set(data);
      },
      error: (err) => console.error('ERREUR:', err)
    });
  }
}