import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from 'src/app/services/client.service';
import { AuthService } from 'src/app/services/auth.service';
import { Client } from 'src/app/models/client';

@Component({
  selector: 'app-voir-profil',
  templateUrl: './voir-profil.component.html',
  styleUrls: ['./voir-profil.component.scss']
})
export class VoirProfilComponent implements OnInit {
  clientData: Client | null = null;
  isEditing = false;
  profileForm: FormGroup;
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      adresse: ['', [Validators.maxLength(200)]],
      dateNaissance: ['']
    });
  }

  ngOnInit() {
    this.loadClientData();
  }

  loadClientData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const clientId = currentUser.clientId;

    if (clientId) {
      this.loading = true;
      this.clientService.getClient(clientId).subscribe({
        next: (client: Client) => {
          this.clientData = client;
          this.profileForm.patchValue({
            nom: client.nom,
            prenom: client.prenom,
            email: client.email,
            telephone: client.telephone,
            adresse: client.adresse || '',
            dateNaissance: client.dateNaissance || ''
          });
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des données du profil: ' + err.message;
          this.loading = false;
          console.error('Error loading client data:', err);
        }
      });
    } else {
      this.errorMessage = 'Aucun client associé à cet utilisateur. Veuillez vous reconnecter.';
      this.loading = false;
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.profileForm.patchValue({
        nom: this.clientData?.nom,
        prenom: this.clientData?.prenom,
        email: this.clientData?.email,
        telephone: this.clientData?.telephone,
        adresse: this.clientData?.adresse || '',
        dateNaissance: this.clientData?.dateNaissance || ''
      });
    }
  }

  updateClient() {
    if (this.profileForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs requis correctement.';
      return;
    }

    if (!this.clientData?.id) {
      this.errorMessage = 'Impossible de mettre à jour le profil: ID du client manquant.';
      return;
    }

    const updatedClient: Client = {
      ...this.profileForm.value,
      id: this.clientData.id,
      commandeIds: this.clientData.commandeIds || []
    };

    this.clientService.updateClient(this.clientData.id, updatedClient).subscribe({
      next: (response: Client) => {
        this.clientData = response;
        this.isEditing = false;
        this.errorMessage = null;
        alert('Profil mis à jour avec succès');
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la mise à jour du profil: ' + err.message;
        console.error('Error updating client:', err);
      }
    });
  }

  deleteClient() {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre profil client ?')) {
      if (!this.clientData?.id) {
        this.errorMessage = 'Impossible de supprimer le profil: ID du client manquant.';
        return;
      }

      this.clientService.deleteClient(this.clientData.id).subscribe({
        next: () => {
          alert('Profil client supprimé avec succès');
          this.authService.removeToken();
          this.authService.navigateTo('/login');
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la suppression du profil: ' + err.message;
          console.error('Error deleting client:', err);
        }
      });
    }
  }
}
