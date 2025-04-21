import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss'],
})
export class InscriptionComponent {
  user = {
    username: '',
    password: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    dateNaissance: '',
  };

  today: string = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

  constructor(private authService: AuthService) {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      console.log('Form is invalid:', form.value);
      return;
    }

    const userToSend = {
      ...this.user,
      dateNaissance: this.user.dateNaissance || null, // Convert empty string to null
    };

    console.log('User data being sent:', userToSend);
    this.authService.register(userToSend).subscribe({
      next: () => console.log('Inscription réussie'),
      error: (err) => {
        console.error('Erreur inscription:', err);
        const errorMessage = err.error?.message || 'Échec de l\'inscription. Veuillez réessayer.';
        alert(errorMessage);
      },
    });
  }
}
