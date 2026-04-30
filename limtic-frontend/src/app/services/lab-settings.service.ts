import { ThemeService } from './theme.service';
import { Injectable, signal, inject } from '@angular/core'; // Added inject
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

  // Inject ThemeService here
  constructor(
    private api: ApiService,
    private themeService: ThemeService 
  ) {}

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
    
    // Use the injected instance and call it as a signal ()
    const currentTheme = this.themeService.theme(); 
    
    if ((!raw || raw.startsWith('/assets/')) && currentTheme === 'dark') return 'limtic-dark.png';
    if ((!raw || raw.startsWith('/assets/')) && currentTheme === 'light') return 'limtic-light.png';
    
    if (raw.startsWith('http')) return raw;
    if (raw.startsWith('/uploads/')) return this.api.getLogoUrl(raw);
    if (raw.startsWith('/')) return raw;
    return raw;
  }

  private fetchPublic(): void {
    this.api.getParametresPublics().subscribe({
      next: (params: any[]) => {
        const get = (cle: string) => params.find(p => p.cle === cle)?.valeur ?? '';
        
        // Update signals
        this.nom.set(get('labo.nom') || 'LIMTIC');
        this.acronyme.set(get('labo.acronyme') || 'LIMTIC');
        this.description.set(get('labo.description') || "Laboratoire d'Informatique...");
        this.email.set(get('labo.email') || 'contact@limtic.tn');
        this.telephone.set(get('labo.telephone'));
        this.adresse.set(get('labo.adresse'));
        this.logoUrl.set(get('labo.logoUrl'));
      },
      error: (err) => console.error('Could not load lab settings', err)
    });
  }
}