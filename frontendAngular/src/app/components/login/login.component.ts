import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  isLoading = false; // Add loading state
  errorMessage: string | null = null; // Add error message state

  constructor(private authService: AuthService) {}

  onSubmit() {
    console.log('Credentials being sent:', this.credentials);
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    this.isLoading = true; // Set loading state
    this.errorMessage = null; // Clear previous errors

    this.authService.login(this.credentials).subscribe({
      next: (response: any) => {
        console.log('Connexion réussie', response);
        this.isLoading = false;

        // Get the user role from localStorage (set by AuthService during login)
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const userRole = currentUser.role ? currentUser.role.toUpperCase() : '';

        // Redirect based on role
        if (userRole === 'ADMIN') {
          this.authService.navigateTo('/page-admin');
        } else {
          this.authService.navigateTo('/voir-profil');
        }
      },
      error: (err) => {
        console.error('Erreur connexion:', err);
        this.isLoading = false;
        this.errorMessage = err.message || 'Échec de la connexion';
      }
    });
  }
}
