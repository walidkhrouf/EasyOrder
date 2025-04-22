import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Commande } from '../models/commande';
import { CommandeRequest } from '../models/commande-request';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = '/commandes'; // Should map to http://localhost:8088/commandes via proxy

  constructor(private http: HttpClient) {}

  getAllCommandes(): Observable<Commande[]> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    console.log('Fetching all commandes from:', this.apiUrl);
    return this.http.get<Commande[]>(this.apiUrl, { headers }).pipe(
      tap(response => console.log('Commandes fetched:', response)),
      catchError(error => {
        console.error('Error fetching commandes:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch commandes'));
      })
    );
  }

  getCommande(id: number): Observable<Commande> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    const url = `${this.apiUrl}/${id}`;
    console.log('Fetching commande from:', url);
    return this.http.get<Commande>(url, { headers }).pipe(
      tap(response => console.log('Commande fetched:', response)),
      catchError(error => {
        console.error('Error fetching commande:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch commande'));
      })
    );
  }

  createCommande(request: CommandeRequest): Observable<Commande> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    console.log('Creating commande at:', this.apiUrl);
    console.log('Request body:', request);
    console.log('Headers:', headers.toString());

    return this.http.post<Commande>(this.apiUrl, request, { headers }).pipe(
      tap(response => console.log('Commande created:', response)),
      catchError(error => {
        console.error('Error creating commande:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to create commande'));
      })
    );
  }

  updateCommande(id: number, commande: Commande): Observable<Commande> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    const url = `${this.apiUrl}/${id}`;
    console.log('Updating commande at:', url);
    console.log('Request body:', commande);
    return this.http.put<Commande>(url, commande, { headers }).pipe(
      tap(response => console.log('Commande updated:', response)),
      catchError(error => {
        console.error('Error updating commande:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to update commande'));
      })
    );
  }

  deleteCommande(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    const deleteUrl = `${this.apiUrl}/${id}`;
    console.log('Deleting commande at:', deleteUrl);

    return this.http.delete<void>(deleteUrl, { headers }).pipe(
      catchError(error => {
        console.error('Error deleting commande:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to delete commande'));
      })
    );
  }
}
