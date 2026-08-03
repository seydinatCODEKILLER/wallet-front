import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PretRequest, PretResponse } from '../models/pret.model';
import { CompteStore } from '../state/compte.store';

@Injectable({ providedIn: 'root' })
export class PretService {
  private readonly http = inject(HttpClient);
  private readonly compteStore = inject(CompteStore);
  private readonly baseUrl = `${environment.apiUrl}/prets`;

  soumettreDemande(data: PretRequest): Observable<PretResponse> {
    return this.http.post<PretResponse>(this.baseUrl, data);
  }

  mesPrets(): Observable<PretResponse[]> {
    return this.http.get<PretResponse[]>(`${this.baseUrl}/mes-prets`);
  }

  getPret(pretId: number): Observable<PretResponse> {
    return this.http.get<PretResponse>(`${this.baseUrl}/${pretId}`);
  }

  remboursementMensuel(mensualiteId: number, montant: number): Observable<PretResponse> {
    return this.http
      .post<PretResponse>(`${this.baseUrl}/${mensualiteId}/rembourser-mensualite`, {})
      .pipe(tap(() => this.compteStore.ajusterSolde(-montant)));
  }

  remboursementTotal(pretId: number, montantRestant: number): Observable<PretResponse> {
    return this.http
      .post<PretResponse>(`${this.baseUrl}/${pretId}/rembourser-total`, {})
      .pipe(tap(() => this.compteStore.ajusterSolde(-montantRestant)));
  }
}
