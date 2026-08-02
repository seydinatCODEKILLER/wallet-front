import { StatutPret, StatutMensualite, ScoreSolvabilite } from './enums';

export interface PretRequest {
  montant: number;
  motif: string;
  dureeEnMois: number;
}

export interface MensualiteResponse {
  id: number;
  numeroEcheance: number;
  montant: number;
  dateEcheance: string;
  statut: StatutMensualite;
  datePaiement: string | null;
}

export interface PretResponse {
  id: number;
  utilisateurId: number;
  nomClient: string;
  montant: number;
  motif: string;
  dureeEnMois: number;
  montantRestant: number;
  statut: StatutPret;
  scoreSolvabiliteClient: ScoreSolvabilite;
  dateCreation: string;
  dateValidation: string | null;
  mensualites: MensualiteResponse[];
}