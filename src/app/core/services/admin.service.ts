import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PretResponse } from '../models/pret.model';
import { DashboardResponse } from '../models/dashboard.model';
import { ClientResponse } from '../models/utilisateur.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}/admin`;
  private readonly baseUrlPrets = `${environment.apiUrl}/admin/prets`;

  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.baseUrl}/dashboard`);
  }

  listerUtilisateurs(): Observable<ClientResponse[]> {
    return this.http.get<ClientResponse[]>(`${this.baseUrl}/utilisateurs`);
  }

  suspendreUtilisateur(id: number): Observable<ClientResponse> {
    return this.http.patch<ClientResponse>(`${this.baseUrl}/utilisateurs/${id}/suspendre`, {});
  }

  reactiverUtilisateur(id: number): Observable<ClientResponse> {
    return this.http.patch<ClientResponse>(`${this.baseUrl}/utilisateurs/${id}/reactiver`, {});
  }

  listerDemandesEnAttente(): Observable<PretResponse[]> {
    return this.http.get<PretResponse[]>(`${this.baseUrlPrets}/en-attente`);
  }

  validerPret(pretId: number): Observable<PretResponse> {
    return this.http.patch<PretResponse>(`${this.baseUrlPrets}/${pretId}/valider`, {});
  }

  rejeterPret(pretId: number): Observable<PretResponse> {
    return this.http.patch<PretResponse>(`${this.baseUrlPrets}/${pretId}/rejeter`, {});
  }
}
