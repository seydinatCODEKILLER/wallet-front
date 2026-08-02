import { ScoreSolvabilite } from './enums';

export interface ClientResponse {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  actif: boolean;
  scoreSolvabilite: ScoreSolvabilite;
  numeroCompte: string;
  solde: number;
}