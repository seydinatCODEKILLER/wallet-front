import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CompteResponse } from '../models/compte.model';
import { CompteStore } from '../state/compte.store';

@Injectable({ providedIn: 'root' })
export class CompteService {

  private readonly http = inject(HttpClient);
  private readonly compteStore = inject(CompteStore);
  private readonly baseUrl = `${environment.apiUrl}/comptes`;

  getMonCompte(): Observable<CompteResponse> {
    return this.http.get<CompteResponse>(`${this.baseUrl}/mon-compte`).pipe(
      tap(compte => this.compteStore.definirCompte(compte))
    );
  }
}