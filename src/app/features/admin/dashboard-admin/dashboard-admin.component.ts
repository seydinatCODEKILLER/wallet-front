import { Component, inject, signal, OnInit, computed } from '@angular/core';
import {
  LucideUsers,
  LucideWallet,
  LucideAlertTriangle,
  LucideLoaderCircle,
} from '@lucide/angular';
import { BaseChartDirective } from 'ng2-charts';
import { AdminService } from '../../../core/services/admin.service';
import { FcfaPipe } from '../../../shared/pipes/fcfa.pipe';
import { DashboardResponse } from '../../../core/models/dashboard.model';
import {
  lineChartOptions,
  doughnutChartOptions,
  barChartOptions,
  construireDonneesLigne,
  construireDonneesAnneau,
  construireDonneesBarres,
} from './dashboard-admin.charts';

@Component({
  selector: 'app-dashboard-admin',
  imports: [
    FcfaPipe,
    LucideUsers,
    LucideWallet,
    LucideAlertTriangle,
    LucideLoaderCircle,
    BaseChartDirective,
  ],
  templateUrl: './dashboard-admin.component.html',
})
export class DashboardAdminComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  protected readonly chargement = signal(true);
  protected readonly erreur = signal<string | null>(null);
  protected readonly stats = signal<DashboardResponse | null>(null);

  // Options statiques, importées telles quelles
  protected readonly lineChartOptions = lineChartOptions;
  protected readonly doughnutChartOptions = doughnutChartOptions;
  protected readonly barChartOptions = barChartOptions;

  // Données dérivées des stats, recalculées automatiquement à chaque mise à jour du signal
  protected readonly lineChartData = computed(() =>
    construireDonneesLigne(this.stats()?.transactions7DerniersJours ?? []),
  );

  protected readonly doughnutChartData = computed(() =>
    construireDonneesAnneau(this.stats()?.repartitionScores ?? []),
  );

  protected readonly barChartData = computed(() =>
    construireDonneesBarres(this.stats()?.prets6DerniersMois ?? []),
  );

  ngOnInit(): void {
    this.adminService.getDashboard().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger les statistiques.');
        this.chargement.set(false);
      },
    });
  }
}
