import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  isLoggedIn     = signal(false);
  userEmail      = signal('');
  userRole       = signal('');
  showNavbar     = signal(true);
  dropdownOuvert = signal<string | null>(null);
  menuOuvert     = signal(false); // hamburger mobile

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkAuth();
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      const hiddenRoutes = ['/dashboard-admin', '/dashboard-chercheur'];
      this.showNavbar.set(!hiddenRoutes.some(r => e.url.startsWith(r)));
      this.checkAuth();
      this.dropdownOuvert.set(null);
      this.menuOuvert.set(false); // ferme le menu mobile à chaque navigation
    });

    // Ferme dropdown si clic en dehors
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.nav-dropdown') && !target.closest('.nav-toggle')) {
        this.dropdownOuvert.set(null);
      }
      if (!target.closest('.navbar')) {
        this.menuOuvert.set(false);
      }
    });
  }

  toggleMenu() {
    this.menuOuvert.set(!this.menuOuvert());
    this.dropdownOuvert.set(null);
  }

  toggleDropdown(nom: string) {
    this.dropdownOuvert.set(this.dropdownOuvert() === nom ? null : nom);
  }

  fermerTout() {
    this.dropdownOuvert.set(null);
    this.menuOuvert.set(false);
  }

  checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn.set(true);
      this.userEmail.set(localStorage.getItem('email') || '');
      this.userRole.set(localStorage.getItem('role') || '');
    } else {
      this.isLoggedIn.set(false);
    }
  }

  logout() {
    localStorage.clear();
    this.isLoggedIn.set(false);
    this.fermerTout();
    this.router.navigate(['/home']);
  }
}