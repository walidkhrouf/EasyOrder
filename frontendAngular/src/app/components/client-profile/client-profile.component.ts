import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';

interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse?: string;
  dateNaissance?: string;
}

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss']
})
export class ClientProfileComponent implements OnInit {
  client: Client = {
    id: 0,
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    dateNaissance: '',
  };

  today: string = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadClientData();
  }

  loadClientData(): void {
    console.log('Starting loadClientData...');

    if (!this.authService.isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      this.authService.navigateTo('/login');
      return;
    }

    const clientId = this.authService.getCurrentClientId();
    console.log('Client ID from localStorage:', clientId);

    if (!clientId) {
      console.log('No client ID found, redirecting to login');
      this.errorMessage = 'Utilisateur non identifié. Veuillez vous reconnecter.';
      this.authService.navigateTo('/login');
      return;
    }

    this.isLoading = true;
    console.log(`Fetching client data for ID: ${clientId}`);

    this.authService.getClientById(clientId).subscribe({
      next: (clientData) => {
        console.log('Client data received:', clientData);
        this.client = {
          ...clientData,
          adresse: clientData.adresse || '',
          dateNaissance: clientData.dateNaissance || '',
        };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error in subscription:', err);
        this.errorMessage = err.message || 'Erreur lors du chargement des données.';
        this.isLoading = false;
      },
      complete: () => {
        console.log('Observable completed');
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      console.log('Form is invalid:', form.value);
      return;
    }

    const clientId = this.authService.getCurrentClientId();
    if (!clientId) {
      this.errorMessage = 'Utilisateur non identifié. Veuillez vous reconnecter.';
      this.authService.navigateTo('/login');
      return;
    }

    const clientData: Partial<Client> = {
      nom: this.client.nom,
      prenom: this.client.prenom,
      email: this.client.email,
      telephone: this.client.telephone,
      ...(this.client.adresse && { adresse: this.client.adresse }),
      ...(this.client.dateNaissance && { dateNaissance: this.client.dateNaissance }),
    };

    this.authService.updateClient(clientId, clientData).subscribe({
      next: (updatedClient) => {
        this.client = {
          ...updatedClient,
          adresse: updatedClient.adresse || '',
          dateNaissance: updatedClient.dateNaissance || '',
        };
        this.successMessage = 'Profil mis à jour avec succès !';
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Erreur lors de la mise à jour du profil.';
        this.successMessage = null;
      }
    });
  }
}
