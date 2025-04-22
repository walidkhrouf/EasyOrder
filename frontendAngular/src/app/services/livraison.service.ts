import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Livraison } from '../models/livraison';

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private apiUrl = '/livraisons'; // Maps to http://localhost:8088/livraisons via proxy

  constructor(private http: HttpClient) {}

  getAllLivraisons(): Observable<Livraison[]> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    console.log('Fetching all livraisons from:', this.apiUrl);
    return this.http.get<Livraison[]>(this.apiUrl, { headers }).pipe(
      tap(response => console.log('Livraisons fetched:', response)),
      catchError(error => {
        console.error('Error fetching livraisons:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch livraisons'));
      })
    );
  }

  getLivraison(id: number): Observable<Livraison> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    const url = `${this.apiUrl}/${id}`;
    console.log('Fetching livraison from:', url);
    return this.http.get<Livraison>(url, { headers }).pipe(
      tap(response => console.log('Livraison fetched:', response)),
      catchError(error => {
        console.error('Error fetching livraison:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch livraison'));
      })
    );
  }

  createLivraison(livraison: Livraison): Observable<Livraison> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    console.log('Creating livraison at:', this.apiUrl);
    console.log('Request body:', livraison);
    return this.http.post<Livraison>(this.apiUrl, livraison, { headers }).pipe(
      tap(response => console.log('Livraison created:', response)),
      catchError(error => {
        console.error('Error creating livraison:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to create livraison'));
      })
    );
  }

  updateLivraison(id: number, livraison: Livraison): Observable<Livraison> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    const url = `${this.apiUrl}/${id}`;
    console.log('Updating livraison at:', url);
    console.log('Request body:', livraison);
    return this.http.put<Livraison>(url, livraison, { headers }).pipe(
      tap(response => console.log('Livraison updated:', response)),
      catchError(error => {
        console.error('Error updating livraison:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to update livraison'));
      })
    );
  }

  deleteLivraison(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    const deleteUrl = `${this.apiUrl}/${id}`;
    console.log('Deleting livraison at:', deleteUrl);
    return this.http.delete<void>(deleteUrl, { headers }).pipe(
      catchError(error => {
        console.error('Error deleting livraison:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to delete livraison'));
      })
    );
  }
}
