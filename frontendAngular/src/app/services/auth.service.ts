import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {}

  register(user: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/login`, credentials);
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  getRole(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded = this.jwtHelper.decodeToken(token);
      return decoded.role;
    }
    return null;
  }

  redirectAfterLogin(): void {
    const role = this.getRole();
    if (role === 'client') {
      this.router.navigate(['/client-profile']);
    } else if (role === 'admin') {
      this.router.navigate(['/page-admin']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
