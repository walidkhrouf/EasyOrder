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

  getAllProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl);
  }
}
