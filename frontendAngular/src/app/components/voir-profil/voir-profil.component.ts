import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-voir-profil',
  templateUrl: './voir-profil.component.html',
  styleUrls: ['./voir-profil.component.scss']
})
export class VoirProfilComponent implements OnInit {
  clientData: any = null;
  isEditing = false;
  updatedClientData: any = {};

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.loadClientData();
  }

  loadClientData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const clientId = currentUser.clientId;
    if (clientId) {
      this.http.get(`/clients/${clientId}`).subscribe({
        next: (response: any) => {
          this.clientData = response.data;
          this.updatedClientData = { ...this.clientData };
        },
        error: (err) => {
          console.error('Error loading client data:', err);
          alert('Erreur lors du chargement des données du client');
        },
      });
    } else {
      alert('Aucun client associé à cet utilisateur');
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.updatedClientData = { ...this.clientData };
    }
  }

  updateClient() {
    const clientId = this.clientData.id;
    this.http.put(`/clients/${clientId}`, this.updatedClientData).subscribe({
      next: (response: any) => {
        this.clientData = response;
        this.isEditing = false;
        alert('Profil mis à jour avec succès');
      },
      error: (err) => {
        console.error('Error updating client:', err);
        alert('Erreur lors de la mise à jour du profil');
      },
    });
  }

  deleteClient() {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre profil client ?')) {
      const clientId = this.clientData.id;
      this.http.delete(`/clients/${clientId}`).subscribe({
        next: () => {
          alert('Profil client supprimé avec succès');
          this.authService.removeToken();
          this.authService.navigateTo('/login'); // Use the new navigateTo method
        },
        error: (err) => {
          console.error('Error deleting client:', err);
          alert('Erreur lors de la suppression du profil');
        },
      });
    }
  }
}
