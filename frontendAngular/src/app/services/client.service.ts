import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Client } from '../models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = '/clients'; // Maps to http://localhost:8088/clients via proxy

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<Client[]> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    console.log('Fetching all clients from:', this.apiUrl);
    return this.http.get<Client[]>(this.apiUrl, { headers }).pipe(
      tap(response => console.log('Clients fetched:', response)),
      catchError(error => {
        console.error('Error fetching clients:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch clients'));
      })
    );
  }

  getClient(id: number): Observable<Client> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    const url = `${this.apiUrl}/${id}`;
    console.log('Fetching client from:', url);
    return this.http.get<Client>(url, { headers }).pipe(
      tap(response => console.log('Client fetched:', response)),
      catchError(error => {
        console.error('Error fetching client:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch client'));
      })
    );
  }

  createClient(client: Client): Observable<Client> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    console.log('Creating client at:', this.apiUrl);
    console.log('Request body:', client);
    return this.http.post<Client>(this.apiUrl, client, { headers }).pipe(
      tap(response => console.log('Client created:', response)),
      catchError(error => {
        console.error('Error creating client:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to create client'));
      })
    );
  }

  updateClient(id: number, client: Client): Observable<Client> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    const url = `${this.apiUrl}/${id}`; // Use id in the URL (e.g., /clients/1)
    console.log('Updating client at:', url);
    console.log('Request body:', client);
    return this.http.put<Client>(url, client, { headers }).pipe(
      tap(response => console.log('Client updated:', response)),
      catchError(error => {
        console.error('Error updating client:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to update client'));
      })
    );
  }

  deleteClient(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();

    const url = `${this.apiUrl}/${id}`; // Use id in the URL (e.g., /clients/1)
    console.log('Deleting client at:', url);
    return this.http.delete<void>(url, { headers }).pipe(
      catchError(error => {
        console.error('Error deleting client:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to delete client'));
      })
    );
  }
}
