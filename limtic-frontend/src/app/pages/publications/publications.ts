import { Component, OnInit, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Publication } from '../../models/chercheur.model';

@Component({
  selector: 'app-publications',
  imports: [],
  templateUrl: './publications.html',
  styleUrl: './publications.css'
})
export class Publications implements OnInit {
  publications = signal<Publication[]>([]);

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getPublications().subscribe(data => this.publications.set(data));
  }
}