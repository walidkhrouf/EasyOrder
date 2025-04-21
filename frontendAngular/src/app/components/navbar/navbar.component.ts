import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isAuthenticated = false;

  constructor(private authService: AuthService, private router: Router) {
    // Check authentication status when the component initializes
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  logout() {
    // Remove the token and currentUser, update status, and redirect to login
    this.authService.removeToken();
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
}
