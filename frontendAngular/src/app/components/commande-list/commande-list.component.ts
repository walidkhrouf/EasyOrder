import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommandeService } from 'src/app/services/commande.service';
import { AuthService } from 'src/app/services/auth.service';
import { Commande } from 'src/app/models/commande';

@Component({
  selector: 'app-commande-list',
  templateUrl: './commande-list.component.html',
  styleUrls: ['./commande-list.component.scss']
})
export class CommandeListComponent implements OnInit {
  commandes: Commande[] = [];
  errorMessage: string | null = null;

  constructor(
    private commandeService: CommandeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    const clientId = this.authService.getCurrentClientId();
    if (!clientId) {
      this.errorMessage = 'Vous devez être connecté pour voir vos commandes.';
      this.router.navigate(['/login']);
      return;
    }

    this.commandeService.getAllCommandes().subscribe({
      next: (commandes) => {
        this.commandes = commandes.filter(commande => commande.clientId === clientId);
        if (this.commandes.length === 0) {
          this.errorMessage = 'Aucune commande trouvée.';
        }
      },
      error: (err) => {
        this.errorMessage = err.message || 'Erreur lors du chargement des commandes.';
      }
    });
  }

  deleteCommande(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      this.commandeService.deleteCommande(id).subscribe({
        next: () => {
          this.commandes = this.commandes.filter(commande => commande.id !== id);
          this.errorMessage = null;
          if (this.commandes.length === 0) {
            this.errorMessage = 'Aucune commande trouvée.';
          }
        },
        error: (err) => {
          this.errorMessage = err.message || 'Erreur lors de la suppression de la commande.';
        }
      });
    }
  }
}
