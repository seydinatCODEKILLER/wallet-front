import { Injectable, signal } from '@angular/core';
import { CompteResponse } from '../models/compte.model';

@Injectable({ providedIn: 'root' })
export class CompteStore {

  private readonly _compte = signal<CompteResponse | null>(null);
  readonly compte = this._compte.asReadonly();

  definirCompte(compte: CompteResponse): void {
    this._compte.set(compte);
  }

  /**
   * Mise à jour optimiste du solde après un virement/remboursement réussi,
   * pour un rafraîchissement instantané sans refaire un appel HTTP.
   */
  ajusterSolde(delta: number): void {
    const compteActuel = this._compte();
    if (compteActuel) {
      this._compte.set({ ...compteActuel, solde: compteActuel.solde + delta });
    }
  }

  reinitialiser(): void {
    this._compte.set(null);
  }
}