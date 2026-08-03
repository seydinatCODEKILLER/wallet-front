import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LucideArrowLeft, LucideCheck, LucideLoaderCircle, LucideWallet } from '@lucide/angular';
import { PretService } from '../../../../core/services/pret.service';
import { PretResponse, MensualiteResponse } from '../../../../core/models/pret.model';
import { FcfaPipe } from '../../../../shared/pipes/fcfa.pipe';
import { BadgeStatutComponent } from '../../../../shared/components/badge-statut/badge-statut.component';

@Component({
  selector: 'app-detail-pret',
  imports: [
    RouterLink,
    DatePipe,
    FcfaPipe,
    BadgeStatutComponent,
    LucideArrowLeft,
    LucideCheck,
    LucideLoaderCircle,
    LucideWallet,
  ],
  templateUrl: './detail-pret.component.html',
})
export class DetailPretComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pretService = inject(PretService);

  protected readonly chargement = signal(true);
  protected readonly pret = signal<PretResponse | null>(null);
  protected readonly erreur = signal<string | null>(null);

  // Suivi de l'action en cours pour désactiver le bon bouton uniquement
  protected readonly mensualiteEnCours = signal<number | null>(null);
  protected readonly remboursementTotalEnCours = signal(false);
  protected readonly confirmationTotalOuverte = signal(false);

  private pretId!: number;

  ngOnInit(): void {
    this.pretId = Number(this.route.snapshot.paramMap.get('id'));
    this.chargerPret();
  }

  private chargerPret(): void {
    this.chargement.set(true);
    this.pretService.getPret(this.pretId).subscribe({
      next: (pret) => {
        this.pret.set(pret);
        this.chargement.set(false);
      },
      error: () => {
        this.chargement.set(false);
        this.erreur.set('Impossible de charger ce prêt');
      },
    });
  }

  rembourserMensualite(mensualite: MensualiteResponse): void {
    this.mensualiteEnCours.set(mensualite.id);
    this.erreur.set(null);

    this.pretService.remboursementMensuel(mensualite.id, mensualite.montant).subscribe({
      next: (pretMisAJour) => {
        this.pret.set(pretMisAJour);
        this.mensualiteEnCours.set(null);
      },
      error: (err) => {
        this.mensualiteEnCours.set(null);
        this.erreur.set(err?.error?.message ?? 'Le remboursement a échoué');
      },
    });
  }

  rembourserTotal(): void {
    const pretActuel = this.pret();
    if (!pretActuel) return;

    this.remboursementTotalEnCours.set(true);
    this.erreur.set(null);

    this.pretService.remboursementTotal(pretActuel.id, pretActuel.montantRestant).subscribe({
      next: (pretMisAJour) => {
        this.pret.set(pretMisAJour);
        this.remboursementTotalEnCours.set(false);
        this.confirmationTotalOuverte.set(false);
      },
      error: (err) => {
        this.remboursementTotalEnCours.set(false);
        this.erreur.set(err?.error?.message ?? 'Le remboursement a échoué');
      },
    });
  }
}
