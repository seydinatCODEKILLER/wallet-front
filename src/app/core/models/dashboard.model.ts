export interface DashboardResponse {
  nombreUtilisateursActifs: number;
  volumeFinancierTotal: number;
  nombrePretsEnRetard: number;

  transactions7DerniersJours: ChartData[];
  repartitionScores: ChartData[];
  prets6DerniersMois: ChartData[];
}

export interface ChartData {
  label: string;
  valeur: number;
}
