import { Injectable, signal, computed } from '@angular/core';
import { Role } from '../models/enums';

interface UtilisateurConnecte {
  utilisateurId: number;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
}

const TOKEN_KEY = 'dtw_token';
const USER_KEY = 'dtw_user';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _token = signal<string | null>(this.lireTokenStocke());
  private readonly _utilisateur = signal<UtilisateurConnecte | null>(this.lireUtilisateurStocke());

  readonly token = this._token.asReadonly();
  readonly utilisateur = this._utilisateur.asReadonly();

  readonly estConnecte = computed(() => this._token() !== null);
  readonly estAdmin = computed(() => this._utilisateur()?.role === Role.ADMIN);
  readonly estClient = computed(() => this._utilisateur()?.role === Role.CLIENT);

  connexion(token: string, utilisateur: UtilisateurConnecte): void {
    this._token.set(token);
    this._utilisateur.set(utilisateur);

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(utilisateur));
  }

  deconnexion(): void {
    this._token.set(null);
    this._utilisateur.set(null);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  private lireTokenStocke(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private lireUtilisateurStocke(): UtilisateurConnecte | null {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  }
}
