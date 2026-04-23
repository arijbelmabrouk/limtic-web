import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
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

    fetch('http://localhost:8080/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.form)
    })
    .then(r => r.json())
    .then(data => {
      this.loading.set(false);
      if (data.message) {
        this.success.set('✅ Votre message a bien été envoyé !');
        this.form = { nom: '', email: '', sujet: '', message: '' };
      } else {
        this.erreur.set('Erreur lors de l\'envoi.');
      }
    })
    .catch(() => {
      this.loading.set(false);
      this.erreur.set('Impossible de contacter le serveur.');
    });
  }
}