import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  LucideArrowUpRight,
  LucideArrowDownLeft,
  LucideArrowLeftRight,
  LucideLandmark,
  LucideEye,
  LucideEyeOff,
  LucideCopy,
  LucideCheck,
  LucideInbox,
} from '@lucide/angular';
import { CompteService } from '../../../core/services/compte.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { CompteStore } from '../../../core/state/compte.store';
import { AuthStore } from '../../../core/state/auth.store';
import { TransactionResponse } from '../../../core/models/transaction.model';
import { FcfaPipe } from '../../../shared/pipes/fcfa.pipe';

@Component({
  selector: 'app-dashboard-client',
  imports: [
    RouterLink,
    DatePipe,
    FcfaPipe,
    LucideArrowUpRight,
    LucideArrowDownLeft,
    LucideArrowLeftRight,
    LucideLandmark,
    LucideEye,
    LucideEyeOff,
    LucideCopy,
    LucideCheck,
    LucideInbox,
  ],
  templateUrl: './dashboard-client.component.html',
})
export class DashboardClientComponent implements OnInit {
  private readonly compteService = inject(CompteService);
  private readonly transactionService = inject(TransactionService);
  protected readonly compteStore = inject(CompteStore);
  protected readonly authStore = inject(AuthStore);

  protected readonly chargement = signal(true);
  protected readonly soldeVisible = signal(true);
  protected readonly numeroCopie = signal(false);
  protected readonly transactionsRecentes = signal<TransactionResponse[]>([]);

  ngOnInit(): void {
    this.compteService.getMonCompte().subscribe();

    this.transactionService.historique().subscribe({
      next: (transactions) => {
        this.transactionsRecentes.set(transactions.slice(0, 5));
        this.chargement.set(false);
      },
      error: () => this.chargement.set(false),
    });
  }

  basculerVisibiliteSolde(): void {
    this.soldeVisible.update((v) => !v);
  }

  copierNumeroCompte(): void {
    const numero = this.compteStore.compte()?.numeroCompte;
    if (!numero) return;

    navigator.clipboard.writeText(numero).then(() => {
      this.numeroCopie.set(true);
      setTimeout(() => this.numeroCopie.set(false), 2000);
    });
  }
}
