import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
  message: string;
  data: {
    token: string;
  };
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
    adresse?: string; // Already optional, matches userToSend
    dateNaissance?: string | null; // Allow null in addition to string | undefined
  }): Observable<any> {
    return this.http.post(`${environment.apiUrl}`, user).pipe(
      tap(() => this.router.navigate(['/login'])),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to register'));
      })
    );
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
