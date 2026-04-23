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
  isLoggedIn = signal(false);
  userEmail = signal('');
  userRole = signal('');
  showNavbar = signal(true);
  dropdownOuvert = signal<string | null>(null);

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
    });

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.nav-dropdown')) {
        this.dropdownOuvert.set(null);
      }
    });
  }

  toggleDropdown(nom: string) {
    this.dropdownOuvert.set(this.dropdownOuvert() === nom ? null : nom);
  }

  fermerDropdowns() {
    this.dropdownOuvert.set(null);
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
    this.router.navigate(['/home']);
  }
}