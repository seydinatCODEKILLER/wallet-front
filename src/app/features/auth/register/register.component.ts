import { Component, inject, signal, computed } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

function motsDePasseIdentiquesValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const mdp = group.get('motDePasse')?.value;
    const confirmation = group.get('confirmationMotDePasse')?.value;
    return mdp === confirmation ? null : { motsDePasseDifferents: true };
  };
}

type Etape = 1 | 2;

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly chargement = signal(false);
  protected readonly erreur = signal<string | null>(null);
  protected readonly etape = signal<Etape>(1);

  protected readonly form = this.fb.group(
    {
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.pattern(/^[0-9]{9}$/)]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      confirmationMotDePasse: ['', [Validators.required]],
    },
    { validators: motsDePasseIdentiquesValidator() },
  );

  // Champs de l'étape 1, utilisés pour valider avant de passer à l'étape 2
  private readonly champsEtape1 = ['nom', 'prenom', 'email', 'telephone'] as const;

  protected readonly etape1Valide = computed(() => {
    // Signal factice pour forcer la réévaluation — voir (input) dans le template
    return this.champsEtape1.every((champ) => this.form.controls[champ].valid);
  });

  suivant(): void {
    const etape1Ok = this.champsEtape1.every((champ) => {
      const control = this.form.controls[champ];
      control.markAsTouched();
      return control.valid;
    });

    if (etape1Ok) {
      this.etape.set(2);
    }
  }

  precedent(): void {
    this.etape.set(1);
  }

  soumettre(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.chargement.set(true);
    this.erreur.set(null);

    const { confirmationMotDePasse, ...requestDTO } = this.form.getRawValue();

    this.authService.register(requestDTO as any).subscribe({
      next: () => this.router.navigate(['/client']),
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set(err?.error?.message ?? "Une erreur est survenue lors de l'inscription");
      },
    });
  }
}