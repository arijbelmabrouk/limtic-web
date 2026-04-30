import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class LabSettingsService {
  nom = signal('LIMTIC');
  acronyme = signal('LIMTIC');
  description = signal(
    "Laboratoire d'Informatique, de Modelisation et des Technologies de l'Information et de la Communication"
  );
  email = signal('contact@limtic.tn');
  telephone = signal('');
  adresse = signal('');
  logoUrl = signal('');

  private loaded = false;

  constructor(private api: ApiService) {}

  loadPublic(): void {
    if (this.loaded) return;
    this.loaded = true;
    this.fetchPublic();
  }

  refresh(): void {
    this.loaded = false;
    this.fetchPublic();
  }

  logoUrlResolved(): string {
    const raw = this.logoUrl();
    if (!raw) return 'limtic-dark.png';
    if (raw.startsWith('http')) return raw;
    if (raw.startsWith('/uploads/')) return this.api.getLogoUrl(raw);
    if (raw.startsWith('/assets/')) return 'limtic-dark.png';
    if (raw.startsWith('/')) return raw;
    return raw;
  }

  private fetchPublic(): void {
    this.api.getParametresPublics().subscribe({
      next: (params: any[]) => {
        const get = (cle: string) => params.find(p => p.cle === cle)?.valeur ?? '';
        const nom = get('labo.nom');
        const acronyme = get('labo.acronyme');
        const description = get('labo.description');
        const email = get('labo.email');
        const telephone = get('labo.telephone');
        const adresse = get('labo.adresse');
        const logoUrl = get('labo.logoUrl');

        if (nom) this.nom.set(nom);
        if (acronyme) this.acronyme.set(acronyme);
        if (description) this.description.set(description);
        if (email) this.email.set(email);
        if (telephone) this.telephone.set(telephone);
        if (adresse) this.adresse.set(adresse);
        if (logoUrl) this.logoUrl.set(logoUrl);
      },
      error: () => {}
    });
  }
}
