import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService, Menu } from 'src/app/services/menu.service';
import { CommandeService } from 'src/app/services/commande.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommandeRequest } from 'src/app/models/commande-request';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {
  menus: Menu[] = [];
  availableMenus: Menu[] = [];
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private menuService: MenuService,
    private commandeService: CommandeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAvailableMenus();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  loadAvailableMenus(): void {
    this.menuService.getAllMenus().subscribe({
      next: (data: Menu[]) => {
        this.menus = data;
        this.availableMenus = this.menus.filter(menu => menu.disponible);
        console.log('Available menus loaded:', this.availableMenus); // Debug log
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des menus disponibles:', err);
        this.errorMessage = 'Erreur lors du chargement des menus.';
      }
    });
  }

  commanderMenu(menu: Menu): void {
    console.log('Attempting to place order for menu:', menu); // Debug log

    // Check if the user is logged in
    const clientId = this.authService.getCurrentClientId();
    if (!clientId) {
      this.errorMessage = 'Vous devez être connecté pour passer une commande.';
      this.router.navigate(['/login']);
      return;
    }
    console.log('Client ID:', clientId); // Debug log

    // Check if the menu has products
    if (!menu.produitIds || menu.produitIds.length === 0) {
      this.errorMessage = 'Ce menu ne contient aucun produit.';
      return;
    }

    // Create the commande request
    const commandeRequest: CommandeRequest = {
      clientId: clientId,
      produitIds: menu.produitIds
    };
    console.log('Commande request:', commandeRequest); // Debug log

    // Send the request to create the commande
    this.commandeService.createCommande(commandeRequest).subscribe({
      next: (commande) => {
        this.errorMessage = null;
        alert(`Commande passée avec succès ! ID: ${commande.id}`);
        this.router.navigate(['/commandes']);
      },
      error: (err) => {
        console.error('Error in commanderMenu:', err); // Debug log
        this.errorMessage = err.message || 'Erreur lors de la commande.';
      }
    });
  }
}
