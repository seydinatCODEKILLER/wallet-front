import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideWallet, LucideLoaderCircle, LucideEye, LucideEyeOff, LucideMail } from '@lucide/angular';
import { AuthService } from '../../../core/services/auth.service';
import { AuthStore } from '../../../core/state/auth.store';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LucideWallet,
    LucideLoaderCircle,
    LucideEye,
    LucideEyeOff,
    LucideMail
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly chargement = signal(false);
  protected readonly erreur = signal<string | null>(null);
  protected readonly afficherMotDePasse = signal(false);

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required]],
  });

  basculerAffichageMotDePasse(): void {
    this.afficherMotDePasse.update((valeur) => !valeur);
  }

  soumettre(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.chargement.set(true);
    this.erreur.set(null);

    this.authService
      .login(this.form.getRawValue() as { email: string; motDePasse: string })
      .subscribe({
        next: () => {
          const destination = this.authStore.estAdmin() ? '/admin' : '/client';
          this.router.navigate([destination]);
        },
        error: (err) => {
          this.chargement.set(false);
          this.erreur.set(err?.error?.message ?? 'Email ou mot de passe incorrect');
        },
      });
  }
}
