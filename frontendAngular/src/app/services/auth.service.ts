import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpHeaders
import { Observable, tap, catchError, throwError, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import {Injectable} from "@angular/core";

interface LoginResponse {
  message: string;
  data: {
    token: string;
  };
}

interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse?: string;
  dateNaissance?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token !== null && token !== undefined;
  }

  getCurrentClientId(): number | null {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      return user.clientId ? Number(user.clientId) : null;
    }
    return null;
  }

  removeToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/login', credentials).pipe(
      tap(response => {
        const token = response.data.token;
        localStorage.setItem('token', token);
        const decoded: any = jwtDecode(token);
        const currentUser = {
          username: decoded.username,
          role: decoded.role,
          clientId: decoded.clientId,
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.router.navigate(['/accueil']);
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to login'));
      })
    );
  }

  register(user: {
    username: string;
    password: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse?: string;
    dateNaissance?: string | null;
  }): Observable<any> {
    return this.http.post(`${environment.apiUrl}`, user).pipe(
      tap(() => this.router.navigate(['/login'])),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to register'));
      })
    );
  }

  getClientById(clientId: number): Observable<Client> {
    const url = `http://localhost:8088/clients/${clientId}`; // Hardcode the full URL
    console.log('Preparing to fetch client data from:', url);

    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();
    console.log('Request headers:', headers);

    return this.http.get<Client>(url, { headers, responseType: 'json' }).pipe(
      tap(response => {
        console.log('HTTP response received:', response);
      }),
      timeout(5000),
      catchError(error => {
        console.error('HTTP error occurred:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch client data'));
      })
    );
  }

  updateClient(clientId: number, clientData: Partial<Client>): Observable<Client> {
    return this.http.put<Client>(`/clients/${clientId}`, clientData).pipe(
      catchError(error => {
        console.error('Error updating client:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to update client data'));
      })
    );
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
