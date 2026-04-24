import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Publication } from '../../models/chercheur.model';

@Component({
  selector: 'app-publications',
  imports: [FormsModule, RouterLink],
  templateUrl: './publications.html',
  styleUrl: './publications.css'
})
export class Publications implements OnInit {
  publications = signal<Publication[]>([]);

  // Filtres
  recherche = signal('');
  filtreType = signal('');
  filtreAnnee = signal('');
  filtreAxe = signal('');
  triPar = signal('annee-desc');

  // Listes dynamiques pour les selects
  annees = computed(() => {
    const a = [...new Set(this.publications().map(p => p.annee))];
    return a.sort((x, y) => y - x);
  });

  axes = computed(() => {
    const a = this.publications()
      .filter(p => p.axe)
      .map(p => p.axe.nom);
    return [...new Set(a)];
  });

  // Publications filtrées + triées
  publicationsFiltrees = computed(() => {
    let list = this.publications();

    // Recherche plein texte
    const q = this.recherche().toLowerCase();
    if (q) {
      list = list.filter(p =>
        p.titre.toLowerCase().includes(q) ||
        p.journal?.toLowerCase().includes(q) ||
        p.resume?.toLowerCase().includes(q)
      );
    }

    // Filtre type
    if (this.filtreType()) {
      list = list.filter(p => p.type === this.filtreType());
    }

    // Filtre année
    if (this.filtreAnnee()) {
      list = list.filter(p => p.annee === Number(this.filtreAnnee()));
    }

    // Filtre axe
    if (this.filtreAxe()) {
      list = list.filter(p => p.axe?.nom === this.filtreAxe());
    }

    // Tri
    const tri = this.triPar();
    if (tri === 'annee-desc') list = [...list].sort((a, b) => b.annee - a.annee);
    if (tri === 'annee-asc')  list = [...list].sort((a, b) => a.annee - b.annee);
    if (tri === 'titre')      list = [...list].sort((a, b) => a.titre.localeCompare(b.titre));

    return list;
  });

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getPublications().subscribe(data => this.publications.set(data));
  }

  resetFiltres() {
    this.recherche.set('');
    this.filtreType.set('');
    this.filtreAnnee.set('');
    this.filtreAxe.set('');
    this.triPar.set('annee-desc');
  }

  // Badge classement
  getBadgeClassement(p: Publication): { label: string, css: string } | null {
    const journal = p.journal?.toLowerCase() || '';
    const titre = p.titre?.toLowerCase() || '';
    if (journal.includes('ieee') || journal.includes('acm') || titre.includes('nature')) {
      return { label: 'Q1', css: 'badge-q1' };
    }
    if (journal.includes('elsevier') || journal.includes('springer')) {
      return { label: 'Q2', css: 'badge-q2' };
    }
    if (p.type === 'Conference' && (journal.includes('international') || journal.includes('core'))) {
      return { label: 'CORE A', css: 'badge-core-a' };
    }
    return null;
  }

  // Export BibTeX
  exportBibtex() {
    const lines = this.publicationsFiltrees().map(p => {
      const key = `${p.journal?.replace(/\s/g, '') || 'pub'}${p.annee}`;
      return `@article{${key},\n  title={${p.titre}},\n  journal={${p.journal || ''}},\n  year={${p.annee}},\n  note={${p.resume || ''}}\n}`;
    });
    this.telecharger(lines.join('\n\n'), 'publications_limtic.bib', 'text/plain');
  }

  // Export CSV
  exportCsv() {
    const header = 'Titre,Type,Journal,Année,Axe,Résumé';
    const rows = this.publicationsFiltrees().map(p =>
      `"${p.titre}","${p.type}","${p.journal || ''}","${p.annee}","${p.axe?.nom || ''}","${p.resume || ''}"`
    );
    this.telecharger([header, ...rows].join('\n'), 'publications_limtic.csv', 'text/csv');
  }

  private telecharger(contenu: string, nom: string, type: string) {
    const blob = new Blob([contenu], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nom;
    a.click();
    URL.revokeObjectURL(url);
  }
}