import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  VirementRequest,
  BeneficiaireResponse,
  TransactionResponse,
} from '../models/transaction.model';
import { CompteStore } from '../state/compte.store';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly http = inject(HttpClient);
  private readonly compteStore = inject(CompteStore);
  private readonly baseUrl = `${environment.apiUrl}/transactions`;

  rechercherBeneficiaire(numeroCompte: string): Observable<BeneficiaireResponse> {
    return this.http.get<BeneficiaireResponse>(`${this.baseUrl}/beneficiaire/${numeroCompte}`);
  }

  effectuerVirement(data: VirementRequest): Observable<TransactionResponse> {
    return this.http
      .post<TransactionResponse>(`${this.baseUrl}/virement`, data)
      .pipe(tap(() => this.compteStore.ajusterSolde(-data.montant)));
  }

  historique(): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.baseUrl}/historique`);
  }
}
