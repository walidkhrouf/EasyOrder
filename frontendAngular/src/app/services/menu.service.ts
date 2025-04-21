import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Menu {
  id: number;
  nom: string;
  description: string;
  prixTotal: number;
  categorie: string;
  disponible: boolean;
  imageUrl: string;
  produitIds: number[];
  tags: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = '/menus'; // Proxy routes to http://localhost:8088/menus

  constructor(private http: HttpClient) {}

  // Fetch all menus (GET /menus)
  getAllMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.apiUrl);
  }

  // Create a new menu (POST /menus)
  createMenu(menu: Menu): Observable<Menu> {
    return this.http.post<Menu>(this.apiUrl, menu);
  }

  // Update a menu (PUT /menus/{id})
  updateMenu(id: number, menu: Menu): Observable<Menu> {
    return this.http.put<Menu>(`${this.apiUrl}/${id}`, menu);
  }

  // Delete a menu (DELETE /menus/{id})
  deleteMenu(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
