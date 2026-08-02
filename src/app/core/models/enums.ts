export enum Role {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT'
}

export enum StatutPret {
  EN_ATTENTE = 'EN_ATTENTE',
  VALIDE = 'VALIDE',
  REJETE = 'REJETE',
  SOLDE = 'SOLDE'
}

export enum StatutMensualite {
  A_PAYER = 'A_PAYER',
  PAYE = 'PAYE',
  RETARD = 'RETARD'
}

export enum ScoreSolvabilite {
  EXCELLENT = 'EXCELLENT',
  BON = 'BON',
  A_RISQUE = 'A_RISQUE',
  MAUVAIS_PAYEUR = 'MAUVAIS_PAYEUR'
}

export enum TypeTransaction {
  VIREMENT = 'VIREMENT',
  CREDIT_PRET = 'CREDIT_PRET',
  REMBOURSEMENT_MENSUEL = 'REMBOURSEMENT_MENSUEL',
  REMBOURSEMENT_TOTAL = 'REMBOURSEMENT_TOTAL'
}