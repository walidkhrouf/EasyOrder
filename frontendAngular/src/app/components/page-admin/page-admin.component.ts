import { Component, OnInit } from '@angular/core';
import { MenuService, Menu } from 'src/app/services/menu.service';
import { ProduitService, Produit } from 'src/app/services/produit.service';
import { CommandeService } from 'src/app/services/commande.service';
import { Commande } from 'src/app/models/commande';
import { LivraisonService } from 'src/app/services/livraison.service';
import { Livraison } from 'src/app/models/livraison';
import { ClientService } from 'src/app/services/client.service';
import { Client } from 'src/app/models/client';
import { CommandeRequest } from 'src/app/models/commande-request';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-page-admin',
  templateUrl: './page-admin.component.html',
  styleUrls: ['./page-admin.component.scss']
})
export class PageAdminComponent implements OnInit {
  menus: Menu[] = [];
  produits: Produit[] = [];
  menuForm: FormGroup;
  isEditingMenu = false;
  selectedMenu: Menu | null = null;
  showMenuForm = false;

  produitForm: FormGroup;
  isEditingProduit = false;
  selectedProduit: Produit | null = null;
  showProduitForm = false;

  commandes: Commande[] = [];
  commandeForm: FormGroup;
  isEditingCommande = false;
  selectedCommande: Commande | null = null;
  showCommandeForm = false;

  livraisons: Livraison[] = [];
  livraisonForm: FormGroup;
  isEditingLivraison = false;
  selectedLivraison: Livraison | null = null;
  showLivraisonForm = false;

  clients: Client[] = [];
  clientForm: FormGroup;
  isEditingClient = false;
  selectedClient: Client | null = null;
  showClientForm = false;
  errorMessage: string | null = null;

  constructor(
    private menuService: MenuService,
    private produitService: ProduitService,
    private commandeService: CommandeService,
    private livraisonService: LivraisonService,
    private clientService: ClientService,
    private fb: FormBuilder
  ) {
    this.menuForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      categorie: ['', Validators.required],
      disponible: [true],
      imageUrl: ['', [Validators.maxLength(255)]],
      tags: [''],
      produitIds: [[], Validators.required]
    });

    this.produitForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      prix: [0, [Validators.required, Validators.min(0)]],
      commandeIds: [[]]
    });

    this.commandeForm = this.fb.group({
      clientId: [null, [Validators.required, Validators.min(1)]],
      produitIds: [[], Validators.required],
      status: ['EN_ATTENTE', Validators.required],
      total: [0, [Validators.required, Validators.min(0)]]
    });

    this.livraisonForm = this.fb.group({
      commandeId: [null, [Validators.required, Validators.min(1)]],
      adresseLivraison: ['', [Validators.required, Validators.minLength(5)]],
      status: ['EN_COURS', Validators.required]
    });

    this.clientForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      adresse: ['', [Validators.maxLength(200)]],
      dateNaissance: [''],
      commandeIds: [[]]
    });
  }

  ngOnInit(): void {
    this.loadMenus();
    this.loadProduits();
    this.loadCommandes();
    this.loadLivraisons();
    this.loadClients();
  }

  loadMenus(): void {
    this.menuService.getAllMenus().subscribe({
      next: (data: Menu[]) => (this.menus = data),
      error: (err: any) => console.error('Erreur lors du chargement des menus:', err)
    });
  }

  loadProduits(): void {
    this.produitService.getAllProduits().subscribe({
      next: (data: Produit[]) => (this.produits = data),
      error: (err: any) => console.error('Erreur lors du chargement des produits:', err)
    });
  }

  openAddMenuForm(): void {
    this.isEditingMenu = false;
    this.selectedMenu = null;
    this.menuForm.reset({ disponible: true, produitIds: [] });
    this.showMenuForm = true;
  }

  openEditMenuForm(menu: Menu): void {
    this.isEditingMenu = true;
    this.selectedMenu = menu;
    this.menuForm.patchValue({
      nom: menu.nom,
      description: menu.description,
      categorie: menu.categorie,
      disponible: menu.disponible,
      imageUrl: menu.imageUrl,
      tags: menu.tags.join(', '),
      produitIds: menu.produitIds
    });
    this.showMenuForm = true;
  }

  closeMenuForm(): void {
    this.showMenuForm = false;
    this.menuForm.reset();
  }

  saveMenu(): void {
    if (this.menuForm.invalid) {
      alert('Veuillez remplir tous les champs requis, y compris la sélection d\'au moins un produit.');
      return;
    }

    const menuData: Menu = {
      ...this.menuForm.value,
      tags: this.menuForm.value.tags ? this.menuForm.value.tags.split(',').map((tag: string) => tag.trim()) : [],
      produitIds: this.menuForm.value.produitIds.map((id: string) => parseInt(id, 10))
    };

    if (this.isEditingMenu && this.selectedMenu) {
      this.menuService.updateMenu(this.selectedMenu.id, menuData).subscribe({
        next: () => {
          this.loadMenus();
          this.closeMenuForm();
        },
        error: (err: any) => console.error('Erreur lors de la mise à jour du menu:', err)
      });
    } else {
      this.menuService.createMenu(menuData).subscribe({
        next: () => {
          this.loadMenus();
          this.closeMenuForm();
        },
        error: (err: any) => console.error('Erreur lors de la création du menu:', err)
      });
    }
  }

  deleteMenu(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce menu ?')) {
      this.menuService.deleteMenu(id).subscribe({
        next: () => this.loadMenus(),
        error: (err: any) => console.error('Erreur lors de la suppression du menu:', err)
      });
    }
  }

  toggleProduit(produitId: number): void {
    const currentProduitIds: number[] = this.menuForm.get('produitIds')?.value || [];
    if (currentProduitIds.includes(produitId)) {
      this.menuForm.get('produitIds')?.setValue(currentProduitIds.filter((id: number) => id !== produitId));
    } else {
      this.menuForm.get('produitIds')?.setValue([...currentProduitIds, produitId]);
    }
    this.menuForm.get('produitIds')?.markAsTouched();
  }

  openAddProduitForm(): void {
    this.isEditingProduit = false;
    this.selectedProduit = null;
    this.produitForm.reset({ prix: 0, commandeIds: [] });
    this.showProduitForm = true;
  }

  openEditProduitForm(produit: Produit): void {
    this.isEditingProduit = true;
    this.selectedProduit = produit;
    this.produitForm.patchValue({
      nom: produit.nom,
      prix: produit.prix,
      commandeIds: produit.commandeIds
    });
    this.showProduitForm = true;
  }

  closeProduitForm(): void {
    this.showProduitForm = false;
    this.produitForm.reset();
  }

  saveProduit(): void {
    if (this.produitForm.invalid) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }

    const produitData: Produit = {
      ...this.produitForm.value,
      commandeIds: this.produitForm.value.commandeIds || []
    };

    if (this.isEditingProduit && this.selectedProduit) {
      this.produitService.updateProduit(this.selectedProduit.id, produitData).subscribe({
        next: () => {
          this.loadProduits();
          this.closeProduitForm();
        },
        error: (err: any) => console.error('Erreur lors de la mise à jour du produit:', err)
      });
    } else {
      this.produitService.createProduit(produitData).subscribe({
        next: () => {
          this.loadProduits();
          this.closeProduitForm();
        },
        error: (err: any) => console.error('Erreur lors de la création du produit:', err)
      });
    }
  }

  deleteProduit(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.produitService.deleteProduit(id).subscribe({
        next: () => this.loadProduits(),
        error: (err: any) => console.error('Erreur lors de la suppression du produit:', err)
      });
    }
  }

  loadCommandes(): void {
    this.commandeService.getAllCommandes().subscribe({
      next: (data: Commande[]) => (this.commandes = data),
      error: (err: any) => console.error('Erreur lors du chargement des commandes:', err)
    });
  }

  openAddCommandeForm(): void {
    this.isEditingCommande = false;
    this.selectedCommande = null;
    this.commandeForm.reset({ status: 'EN_ATTENTE', total: 0, produitIds: [] });
    this.showCommandeForm = true;
  }

  openEditCommandeForm(commande: Commande): void {
    this.isEditingCommande = true;
    this.selectedCommande = commande;
    this.commandeForm.patchValue({
      clientId: commande.clientId,
      produitIds: commande.produitIds,
      status: commande.status,
      total: commande.total
    });
    this.showCommandeForm = true;
  }

  closeCommandeForm(): void {
    this.showCommandeForm = false;
    this.commandeForm.reset();
  }

  saveCommande(): void {
    if (this.commandeForm.invalid) {
      alert('Veuillez remplir tous les champs requis, y compris la sélection d\'au moins un produit.');
      return;
    }

    const commandeData: any = {
      ...this.commandeForm.value,
      produitIds: this.commandeForm.value.produitIds.map((id: string) => parseInt(id, 10))
    };

    if (this.isEditingCommande && this.selectedCommande) {
      this.commandeService.updateCommande(this.selectedCommande.id!, commandeData).subscribe({
        next: () => {
          this.loadCommandes();
          this.closeCommandeForm();
        },
        error: (err: any) => console.error('Erreur lors de la mise à jour de la commande:', err)
      });
    } else {
      const commandeRequest: CommandeRequest = {
        clientId: commandeData.clientId,
        produitIds: commandeData.produitIds
      };
      this.commandeService.createCommande(commandeRequest).subscribe({
        next: () => {
          this.loadCommandes();
          this.closeCommandeForm();
        },
        error: (err: any) => console.error('Erreur lors de la création de la commande:', err)
      });
    }
  }

  deleteCommande(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      this.commandeService.deleteCommande(id).subscribe({
        next: () => this.loadCommandes(),
        error: (err: any) => console.error('Erreur lors de la suppression de la commande:', err)
      });
    }
  }

  toggleProduitForCommande(produitId: number): void {
    const currentProduitIds: number[] = this.commandeForm.get('produitIds')?.value || [];
    if (currentProduitIds.includes(produitId)) {
      this.commandeForm.get('produitIds')?.setValue(currentProduitIds.filter((id: number) => id !== produitId));
    } else {
      this.commandeForm.get('produitIds')?.setValue([...currentProduitIds, produitId]);
    }
    this.commandeForm.get('produitIds')?.markAsTouched();
  }

  loadLivraisons(): void {
    this.livraisonService.getAllLivraisons().subscribe({
      next: (data: Livraison[]) => (this.livraisons = data),
      error: (err: any) => console.error('Erreur lors du chargement des livraisons:', err)
    });
  }

  openAddLivraisonForm(): void {
    this.isEditingLivraison = false;
    this.selectedLivraison = null;
    this.livraisonForm.reset({ status: 'EN_COURS' });
    this.showLivraisonForm = true;
  }

  openEditLivraisonForm(livraison: Livraison): void {
    this.isEditingLivraison = true;
    this.selectedLivraison = livraison;
    this.livraisonForm.patchValue({
      commandeId: livraison.commandeId,
      adresseLivraison: livraison.adresseLivraison,
      status: livraison.status
    });
    this.showLivraisonForm = true;
  }

  closeLivraisonForm(): void {
    this.showLivraisonForm = false;
    this.livraisonForm.reset();
  }

  saveLivraison(): void {
    if (this.livraisonForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs requis.';
      return;
    }

    const livraisonData: Livraison = {
      ...this.livraisonForm.value
    };

    if (this.isEditingLivraison && this.selectedLivraison) {
      this.livraisonService.updateLivraison(this.selectedLivraison.id!, livraisonData).subscribe({
        next: () => {
          this.loadLivraisons();
          this.closeLivraisonForm();
          this.errorMessage = null;
        },
        error: (err: any) => {
          this.errorMessage = 'Erreur lors de la mise à jour de la livraison: ' + err.message;
        }
      });
    } else {
      this.livraisonService.createLivraison(livraisonData).subscribe({
        next: () => {
          this.loadLivraisons();
          this.closeLivraisonForm();
          this.errorMessage = null;
        },
        error: (err: any) => {
          this.errorMessage = 'Erreur lors de la création de la livraison: ' + err.message;
        }
      });
    }
  }

  deleteLivraison(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette livraison ?')) {
      this.livraisonService.deleteLivraison(id).subscribe({
        next: () => this.loadLivraisons(),
        error: (err: any) => console.error('Erreur lors de la suppression de la livraison:', err)
      });
    }
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data: Client[]) => (this.clients = data),
      error: (err: any) => {
        this.errorMessage = 'Erreur lors du chargement des clients: ' + err.message;
        console.error('Erreur lors du chargement des clients:', err);
      }
    });
  }

  openEditClientForm(client: Client): void {
    this.isEditingClient = true;
    this.selectedClient = client;
    this.clientForm.patchValue({
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      telephone: client.telephone,
      adresse: client.adresse || '',
      dateNaissance: client.dateNaissance || '',
      commandeIds: client.commandeIds || []
    });
    this.showClientForm = true;
  }

  closeClientForm(): void {
    this.showClientForm = false;
    this.clientForm.reset();
  }

  saveClient(): void {
    if (this.clientForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs requis.';
      return;
    }

    const clientData: Client = {
      ...this.clientForm.value,
      commandeIds: this.clientForm.value.commandeIds || []
    };

    if (this.isEditingClient && this.selectedClient && this.selectedClient.id !== undefined) {
      clientData.id = this.selectedClient.id;
      this.clientService.updateClient(this.selectedClient.id, clientData).subscribe({
        next: () => {
          this.loadClients();
          this.closeClientForm();
          this.errorMessage = null;
        },
        error: (err: any) => {
          this.errorMessage = 'Erreur lors de la mise à jour du client: ' + err.message;
        }
      });
    } else {
      this.errorMessage = 'Impossible de mettre à jour le client: ID manquant.';
    }
  }

  deleteClient(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          this.loadClients();
          this.errorMessage = null;
        },
        error: (err: any) => {
          this.errorMessage = 'Erreur lors de la suppression du client: ' + err.message;
        }
      });
    }
  }
}
