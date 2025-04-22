import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Produit {
  id: number;
  nom: string;
  prix: number;
  commandeIds: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = '/produits'; // Proxy routes to http://localhost:8088/produits (gestion-produits:8085/api/produits)

  constructor(private http: HttpClient) {}

  // Fetch all products (GET /produits)
  getAllProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl);
  }

  // Create a new product (POST /produits)
  createProduit(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.apiUrl, produit);
  }

  // Update a product (PUT /produits/{id})
  updateProduit(id: number, produit: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/${id}`, produit);
  }

  // Delete a product (DELETE /produits/{id})
  deleteProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
