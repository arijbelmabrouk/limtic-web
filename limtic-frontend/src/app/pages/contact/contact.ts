import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  private api = inject(ApiService);

  form = {
    nom: '',
    email: '',
    sujet: '',
    message: ''
  };

  loading = signal(false);
  success = signal('');
  erreur  = signal('');

  onSubmit() {
    if (!this.form.nom || !this.form.email || !this.form.sujet || !this.form.message) {
      this.erreur.set('Veuillez remplir tous les champs.');
      return;
    }
    this.loading.set(true);
    this.erreur.set('');
    this.success.set('');

    this.api.post('contact', this.form).subscribe({
      next: (data: any) => {
        this.loading.set(false);
        if (data.message) {
          this.success.set('✅ Votre message a bien été envoyé !');
          this.form = { nom: '', email: '', sujet: '', message: '' };
        } else {
          this.erreur.set('Erreur lors de l\'envoi.');
        }
      },
      error: (err: any) => {
        this.loading.set(false);
        const msg = err?.error?.message || err?.statusText || 'Impossible de contacter le serveur.';
        this.erreur.set(msg);
      }
    });
  }
}