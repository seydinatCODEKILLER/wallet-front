import { Role } from './enums';

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface AuthResponse {
  token: string;
  utilisateurId: number;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
}