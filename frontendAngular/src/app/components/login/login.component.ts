import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  credentials = { username: '', password: '' };

  constructor(private authService: AuthService) {}

  onSubmit() {
    console.log('Credentials being sent:', this.credentials);
    if (!this.credentials.username || !this.credentials.password) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
    this.authService.login(this.credentials).subscribe({
      next: () => {
        console.log('Connexion réussie');
      },
      error: (err) => {
        console.error('Erreur connexion:', err);
        const errorMessage = err.message || 'Échec de la connexion';
        alert(errorMessage);
      }
    });
  }
}
