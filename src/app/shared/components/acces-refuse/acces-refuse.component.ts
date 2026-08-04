import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../../core/state/auth.store';
import { LucideShieldAlert, LucideLogOut } from '@lucide/angular';

@Component({
  selector: 'app-acces-refuse',
  imports: [LucideShieldAlert, LucideLogOut],
  templateUrl: './acces-refuse.component.html',
})
export class AccesRefuseComponent {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly utilisateur = this.authStore.utilisateur;

  accueil(): void {
    if (this.authStore.estConnecte()) {
      this.router.navigate([this.authStore.estAdmin() ? '/admin' : '/client']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  deconnexion(): void {
    this.authStore.deconnexion();
    this.router.navigate(['/login']);
  }
}
