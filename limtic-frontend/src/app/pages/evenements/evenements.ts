import { Component, OnInit, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Evenement } from '../../models/chercheur.model';

@Component({
  selector: 'app-evenements',
  imports: [SlicePipe],
  templateUrl: './evenements.html',
  styleUrl: './evenements.css'
})
export class Evenements implements OnInit {
  evenements = signal<Evenement[]>([]);

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getEvenements().subscribe(data => this.evenements.set(data));
  }
}