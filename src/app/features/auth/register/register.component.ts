import { Component, inject, signal } from '@angular/core';
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
