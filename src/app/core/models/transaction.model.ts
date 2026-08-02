import { TypeTransaction } from './enums';

export interface VirementRequest {
  numeroCompteDestinataire: string;
  montant: number;
  description?: string;
}

export interface BeneficiaireResponse {
  numeroCompte: string;
  nomComplet: string;
}

export interface TransactionResponse {
  id: number;
  numeroCompteSource: string | null;
  numeroCompteDestination: string | null;
  montant: number;
  type: TypeTransaction;
  description: string;
  dateTransaction: string;
  sens: 'ENTREE' | 'SORTIE';
}