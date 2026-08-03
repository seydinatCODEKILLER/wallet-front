import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LucideArrowLeft, LucideCheck, LucideLoaderCircle, LucideWallet } from '@lucide/angular';
import { PretService } from '../../../../core/services/pret.service';
import { PretResponse, MensualiteResponse } from '../../../../core/models/pret.model';
import { FcfaPipe } from '../../../../shared/pipes/fcfa.pipe';
import { BadgeStatutComponent } from '../../../../shared/components/badge-statut/badge-statut.component';
import { ConfirmationModalComponent } from '../../../../shared/components/confirmation-modal/confirmation-modal.component';

type CibleConfirmation =
  { type: 'mensualite'; mensualite: MensualiteResponse } | { type: 'total'; montant: number };

@Component({
  selector: 'app-detail-pret',
  imports: [
    RouterLink,
    DatePipe,
    FcfaPipe,
    BadgeStatutComponent,
    ConfirmationModalComponent,
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

  // Action ciblée par la modale de confirmation (null = modale fermée)
  protected readonly cible = signal<CibleConfirmation | null>(null);

  protected readonly messageConfirmation = computed(() => {
    const c = this.cible();
    if (!c) return '';

    if (c.type === 'mensualite') {
      const montant = new FcfaPipe().transform(c.mensualite.montant);
      return `Votre solde sera débité de ${montant} FCFA pour l'échéance n°${c.mensualite.numeroEcheance}.`;
    } else {
      const montant = new FcfaPipe().transform(c.montant);
      return `Votre solde sera débité de ${montant} FCFA pour solder intégralement ce prêt.`;
    }
  });

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

  demanderConfirmationMensualite(mensualite: MensualiteResponse): void {
    this.cible.set({ type: 'mensualite', mensualite });
  }

  demanderConfirmationTotal(): void {
    const pretActuel = this.pret();
    if (!pretActuel) return;
    this.cible.set({ type: 'total', montant: pretActuel.montantRestant });
  }

  annulerConfirmation(): void {
    if (this.mensualiteEnCours() !== null || this.remboursementTotalEnCours()) return;
    this.cible.set(null);
  }

  confirmerAction(): void {
    const cible = this.cible();
    if (!cible) return;

    this.erreur.set(null);

    if (cible.type === 'mensualite') {
      this.mensualiteEnCours.set(cible.mensualite.id);
      this.pretService
        .remboursementMensuel(cible.mensualite.id, cible.mensualite.montant)
        .subscribe({
          next: (pretMisAJour) => {
            this.pret.set(pretMisAJour);
            this.mensualiteEnCours.set(null);
            this.cible.set(null);
          },
          error: (err) => {
            this.mensualiteEnCours.set(null);
            this.cible.set(null);
            this.erreur.set(err?.error?.message ?? 'Le remboursement a échoué');
          },
        });
    } else {
      const pretActuel = this.pret();
      if (!pretActuel) return;

      this.remboursementTotalEnCours.set(true);
      this.pretService.remboursementTotal(pretActuel.id, cible.montant).subscribe({
        next: (pretMisAJour) => {
          this.pret.set(pretMisAJour);
          this.remboursementTotalEnCours.set(false);
          this.cible.set(null);
        },
        error: (err) => {
          this.remboursementTotalEnCours.set(false);
          this.cible.set(null);
          this.erreur.set(err?.error?.message ?? 'Le remboursement a échoué');
        },
      });
    }
  }
}
