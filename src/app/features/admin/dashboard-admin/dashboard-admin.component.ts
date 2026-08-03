import { Component, inject, signal, OnInit } from '@angular/core';
import {
  LucideUsers,
  LucideWallet,
  LucideAlertTriangle,
  LucideLoaderCircle,
} from '@lucide/angular';
import { AdminService } from '../../../core/services/admin.service';
import { FcfaPipe } from '../../../shared/pipes/fcfa.pipe';
import { DashboardResponse } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard-admin',
  imports: [FcfaPipe, LucideUsers, LucideWallet, LucideAlertTriangle, LucideLoaderCircle],
  templateUrl: './dashboard-admin.component.html',
})
export class DashboardAdminComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  protected readonly chargement = signal(true);
  protected readonly erreur = signal<string | null>(null);
  protected readonly stats = signal<DashboardResponse | null>(null);

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
