import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';
import { AuthStore } from '../state/auth.store';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, data).pipe(
      tap(response => this.stockerSession(response))
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data).pipe(
      tap(response => this.stockerSession(response))
    );
  }

  logout(): void {
    this.authStore.deconnexion();
  }

  private stockerSession(response: AuthResponse): void {
    this.authStore.connexion(response.token, {
      utilisateurId: response.utilisateurId,
      nom: response.nom,
      prenom: response.prenom,
      email: response.email,
      role: response.role
    });
  }
}