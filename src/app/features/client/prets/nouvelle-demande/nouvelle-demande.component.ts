import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideArrowLeft, LucideLoaderCircle } from '@lucide/angular';
import { PretService } from '../../../../core/services/pret.service';
import { FcfaPipe } from '../../../../shared/pipes/fcfa.pipe';

@Component({
  selector: 'app-nouvelle-demande',
  imports: [ReactiveFormsModule, RouterLink, FcfaPipe, LucideArrowLeft, LucideLoaderCircle],
  templateUrl: './nouvelle-demande.component.html',
})
export class NouvelleDemandeComponent {
  private readonly fb = inject(FormBuilder);
  private readonly pretService = inject(PretService);
  private readonly router = inject(Router);

  protected readonly chargement = signal(false);
  protected readonly erreur = signal<string | null>(null);

  protected readonly form = this.fb.group({
    montant: [null as number | null, [Validators.required, Validators.min(1000)]],
    motif: ['', [Validators.required, Validators.minLength(3)]],
    dureeEnMois: [
      null as number | null,
      [Validators.required, Validators.min(1), Validators.max(60)],
    ],
  });

  // Le formulaire converti en Signal, avec une valeur initiale garantie
  private readonly valeursForm = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });

  // Estimation en direct de la mensualité — recalculée automatiquement à chaque changement
  protected readonly mensualiteEstimee = computed(() => {
    const { montant, dureeEnMois } = this.valeursForm();
    if (!montant || !dureeEnMois || dureeEnMois <= 0) return null;
    return Math.round(montant / dureeEnMois);
  });

  soumettre(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.chargement.set(true);
    this.erreur.set(null);

    this.pretService.soumettreDemande(this.form.getRawValue() as any).subscribe({
      next: (pret) => this.router.navigate(['/client/prets', pret.id]),
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set(err?.error?.message ?? 'Une erreur est survenue');
      },
    });
  }
}
