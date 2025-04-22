import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const token = localStorage.getItem('token');

    // Check if the user is logged in (has a token)
    if (!token || !currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    // Normalize the role to uppercase for comparison
    const userRole = currentUser.role ? currentUser.role.toUpperCase() : '';

    // Check if the user has the ADMIN role (case-insensitive)
    if (userRole === 'ADMIN') {
      return true;
    } else {
      this.router.navigate(['/voir-profil']);
      return false;
    }
  }
}
