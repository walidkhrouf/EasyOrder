import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService, Menu } from 'src/app/services/menu.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {
  menus: Menu[] = [];
  availableMenus: Menu[] = [];

  constructor(private router: Router, private menuService: MenuService) {}

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
      },
      error: (err: any) => console.error('Erreur lors du chargement des menus disponibles:', err)
    });
  }
}
