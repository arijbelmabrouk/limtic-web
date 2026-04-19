import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  isLoggedIn = signal(false);
  userEmail = signal('');
  userRole = signal('');
  showNavbar = signal(true);

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkAuth();
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      const hiddenRoutes = ['/dashboard-admin', '/dashboard-chercheur'];
      this.showNavbar.set(!hiddenRoutes.some(r => e.url.startsWith(r)));
      this.checkAuth();
    });
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