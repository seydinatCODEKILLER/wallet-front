import { ChartOptions, ChartData } from 'chart.js';

export interface PointGraphique {
  label: string;
  valeur: number;
}

// Palette centralisée, alignée sur les design tokens de l'app (styles.css @theme)
export const COULEURS_GRAPHIQUE = {
  primaire: '#2F6F62',
  primaireTransparent: 'rgba(47, 111, 98, 0.1)',
  accent: '#D9A441',
  avertissement: '#C97B4A',
  danger: '#B8564F',
} as const;

// --- Graphique en courbe : transactions des 7 derniers jours ---

export const lineChartOptions: ChartOptions<'line'> = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
};

export function construireDonneesLigne(data: PointGraphique[]): ChartData<'line'> {
  return {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.valeur),
        fill: true,
        borderColor: COULEURS_GRAPHIQUE.primaire,
        backgroundColor: COULEURS_GRAPHIQUE.primaireTransparent,
        tension: 0.4,
      },
    ],
  };
}

// --- Graphique en anneau : répartition des scores de solvabilité ---

export const doughnutChartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  cutout: '65%',
};

export function construireDonneesAnneau(data: PointGraphique[]): ChartData<'doughnut'> {
  return {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.valeur),
        backgroundColor: [
          COULEURS_GRAPHIQUE.primaire,
          COULEURS_GRAPHIQUE.accent,
          COULEURS_GRAPHIQUE.avertissement,
          COULEURS_GRAPHIQUE.danger,
        ],
      },
    ],
  };
}

// --- Graphique en barres : demandes de prêt des 6 derniers mois ---

export const barChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
};

export function construireDonneesBarres(data: PointGraphique[]): ChartData<'bar'> {
  return {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.valeur),
        backgroundColor: COULEURS_GRAPHIQUE.accent,
        borderRadius: 6,
      },
    ],
  };
}
