import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, of, catchError, startWith } from 'rxjs';
import {
  LucideArrowLeft,
  LucideLoaderCircle,
  LucideCheck,
  LucideCircleAlert,
  LucideSend,
} from '@lucide/angular';
import { TransactionService } from '../../../core/services/transaction.service';
import { CompteStore } from '../../../core/state/compte.store';
import { BeneficiaireResponse } from '../../../core/models/transaction.model';
import { FcfaPipe } from '../../../shared/pipes/fcfa.pipe';

@Component({
  selector: 'app-virement',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FcfaPipe,
    LucideArrowLeft,
    LucideLoaderCircle,
    LucideCheck,
    LucideCircleAlert,
    LucideSend,
  ],
  templateUrl: './virement.component.html',
})
export class VirementComponent {
  private readonly fb = inject(FormBuilder);
  private readonly transactionService = inject(TransactionService);
  protected readonly compteStore = inject(CompteStore);
  private readonly router = inject(Router);

  protected readonly chargement = signal(false);
  protected readonly erreur = signal<string | null>(null);
  protected readonly succes = signal(false);

  protected readonly form = this.fb.group({
    numeroCompteDestinataire: ['', [Validators.required, Validators.minLength(5)]],
    montant: [null as number | null, [Validators.required, Validators.min(1)]],
    description: [''],
  });

  // Recherche de bénéficiaire en temps réel : debounce + annule la requête précédente si l'utilisateur retape
  protected readonly rechercheBeneficiaire = toSignal(
    this.form.controls.numeroCompteDestinataire.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((numero) => {
        if (!numero || numero.length < 5) {
          return of({ statut: 'vide' as const });
        }
        return this.transactionService.rechercherBeneficiaire(numero).pipe(
          switchMap((beneficiaire: BeneficiaireResponse) =>
            of({ statut: 'trouve' as const, beneficiaire }),
          ),
          startWith({ statut: 'recherche' as const }),
          catchError(() => of({ statut: 'introuvable' as const })),
        );
      }),
    ),
    { initialValue: { statut: 'vide' as const } },
  );

  protected readonly soldeInsuffisant = computed(() => {
    const montant = this.form.controls.montant.value;
    const solde = this.compteStore.compte()?.solde ?? 0;
    return montant !== null && montant > solde;
  });

  soumettre(): void {
    const resultat = this.rechercheBeneficiaire();
    if (this.form.invalid || resultat.statut !== 'trouve' || this.soldeInsuffisant()) {
      this.form.markAllAsTouched();
      return;
    }

    this.chargement.set(true);
    this.erreur.set(null);

    this.transactionService.effectuerVirement(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.chargement.set(false);
        this.succes.set(true);
        setTimeout(() => this.router.navigate(['/client/dashboard']), 1800);
      },
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set(err?.error?.message ?? 'Le virement a échoué');
      },
    });
  }
}
