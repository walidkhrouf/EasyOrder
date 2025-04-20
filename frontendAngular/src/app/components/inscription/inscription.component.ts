import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent {
  inscriptionForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.inscriptionForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['client', Validators.required]
    });
  }

  onSubmit() {
    if (this.inscriptionForm.invalid) {
      return;
    }

    this.authService.register(this.inscriptionForm.value).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.errorMessage = null;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Erreur lors de l’inscription';
        this.successMessage = null;
      }
    });
  }
}
