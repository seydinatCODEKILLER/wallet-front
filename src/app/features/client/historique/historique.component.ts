import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  LucideArrowUpRight,
  LucideArrowDownLeft,
  LucideInbox,
  LucideArrowLeft,
} from '@lucide/angular';
import { TransactionService } from '../../../core/services/transaction.service';
import { TransactionResponse } from '../../../core/models/transaction.model';
import { FcfaPipe } from '../../../shared/pipes/fcfa.pipe';

type FiltreSens = 'TOUS' | 'ENTREE' | 'SORTIE';

interface GroupeTransactions {
  libelleDate: string;
  transactions: TransactionResponse[];
}

@Component({
  selector: 'app-historique',
  imports: [
    RouterLink,
    DatePipe,
    FcfaPipe,
    LucideArrowUpRight,
    LucideArrowDownLeft,
    LucideInbox,
    LucideArrowLeft,
  ],
  templateUrl: './historique.component.html',
})
export class HistoriqueComponent implements OnInit {
  private readonly transactionService = inject(TransactionService);

  protected readonly chargement = signal(true);
  protected readonly erreur = signal<string | null>(null);
  protected readonly transactions = signal<TransactionResponse[]>([]);
  protected readonly filtreSens = signal<FiltreSens>('TOUS');

  protected readonly transactionsFiltrees = computed(() => {
    const filtre = this.filtreSens();
    const toutes = this.transactions();
    if (filtre === 'TOUS') return toutes;
    return toutes.filter((t) => t.sens === filtre);
  });

  protected readonly groupes = computed<GroupeTransactions[]>(() => {
    const liste = this.transactionsFiltrees();
    const groupesMap = new Map<string, TransactionResponse[]>();

    for (const transaction of liste) {
      const libelle = this.libelleDate(transaction.dateTransaction);
      const groupe = groupesMap.get(libelle);
      if (groupe) {
        groupe.push(transaction);
      } else {
        groupesMap.set(libelle, [transaction]);
      }
    }

    return Array.from(groupesMap.entries()).map(([libelleDate, transactions]) => ({
      libelleDate,
      transactions,
    }));
  });

  protected readonly totalEntrees = computed(() =>
    this.transactions()
      .filter((t) => t.sens === 'ENTREE')
      .reduce((acc, t) => acc + t.montant, 0),
  );

  protected readonly totalSorties = computed(() =>
    this.transactions()
      .filter((t) => t.sens === 'SORTIE')
      .reduce((acc, t) => acc + t.montant, 0),
  );

  ngOnInit(): void {
    this.transactionService.historique().subscribe({
      next: (transactions) => {
        this.transactions.set(transactions);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set("Impossible de charger l'historique");
        this.chargement.set(false);
      },
    });
  }

  changerFiltre(filtre: FiltreSens): void {
    this.filtreSens.set(filtre);
  }

  private libelleDate(dateIso: string): string {
    const date = new Date(dateIso);
    const aujourdhui = new Date();
    const hier = new Date();
    hier.setDate(aujourdhui.getDate() - 1);

    if (this.estMemeJour(date, aujourdhui)) return "Aujourd'hui";
    if (this.estMemeJour(date, hier)) return 'Hier';

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: date.getFullYear() !== aujourdhui.getFullYear() ? 'numeric' : undefined,
    });
  }

  private estMemeJour(a: Date, b: Date): boolean {
    return (
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear()
    );
  }
}
