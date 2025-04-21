import { Component, OnInit } from '@angular/core';
import { MenuService, Menu } from 'src/app/services/menu.service';
import { ProduitService, Produit } from 'src/app/services/produit.service';
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
  isEditing = false;
  selectedMenu: Menu | null = null;
  showForm = false;

  constructor(
    private menuService: MenuService,
    private produitService: ProduitService,
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
  }

  ngOnInit(): void {
    this.loadMenus();
    this.loadProduits();
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

  openAddForm(): void {
    this.isEditing = false;
    this.selectedMenu = null;
    this.menuForm.reset({ disponible: true, produitIds: [] });
    this.showForm = true;
  }

  openEditForm(menu: Menu): void {
    this.isEditing = true;
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
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
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

    if (this.isEditing && this.selectedMenu) {
      this.menuService.updateMenu(this.selectedMenu.id, menuData).subscribe({
        next: () => {
          this.loadMenus();
          this.closeForm();
        },
        error: (err: any) => console.error('Erreur lors de la mise à jour du menu:', err)
      });
    } else {
      this.menuService.createMenu(menuData).subscribe({
        next: () => {
          this.loadMenus();
          this.closeForm();
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
    this.menuForm.get('produitIds')?.markAsTouched(); // Ensure validation is triggered
  }
}
