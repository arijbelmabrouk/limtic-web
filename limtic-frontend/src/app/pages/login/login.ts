import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  motDePasse = '';
  erreur = signal('');
  loading = signal(false);

  constructor(private router: Router) {}

  onSubmit() {
    this.loading.set(true);
    this.erreur.set('');

    fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: this.email, motDePasse: this.motDePasse })
    })
    .then(res => res.json())
    .then(data => {
  this.loading.set(false);
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('email', data.email);
    if (data.role === 'ADMIN') {
      this.router.navigate(['/dashboard-admin']);
    } else if (data.role === 'CHERCHEUR') {
      this.router.navigate(['/dashboard-chercheur']);
    } else {
      this.router.navigate(['/home']);
    }
  } else {
    this.erreur.set(data.error || 'Erreur de connexion');
  }
})
    .catch(() => {
      this.loading.set(false);
      this.erreur.set('Impossible de contacter le serveur');
    });
  }
}