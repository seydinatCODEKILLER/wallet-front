import { Component, inject, signal, OnInit } from '@angular/core';
import {
  LucideUsers,
  LucideLoaderCircle,
  LucideBan,
  LucideCheckCircle,
  LucideShieldCheck,
} from '@lucide/angular';
import { FcfaPipe } from '../../../shared/pipes/fcfa.pipe';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { AdminService } from '../../../core/services/admin.service';
import { ClientResponse } from '../../../core/models/utilisateur.model';
import { ScoreSolvabilite } from '../../../core/models/enums';

@Component({
  selector: 'app-utilisateurs',
  imports: [
    FcfaPipe,
    ConfirmationModalComponent,
    LucideUsers,
    LucideLoaderCircle,
    LucideBan,
    LucideCheckCircle,
    LucideShieldCheck,
  ],
  templateUrl: './utilisateurs.component.html',
})
export class UtilisateursComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  protected readonly chargement = signal(true);
  protected readonly erreur = signal<string | null>(null);
  protected readonly clients = signal<ClientResponse[]>([]);

  // Pour suivre quel utilisateur est en cours de suspension/réactivation
  protected readonly actionEnCours = signal<number | null>(null);

  // Client actuellement ciblé par la modale de confirmation (null = modale fermée)
  protected readonly clientCible = signal<ClientResponse | null>(null);

  ngOnInit(): void {
    this.chargerClients();
  }

  chargerClients(): void {
    this.chargement.set(true);
    this.adminService.listerUtilisateurs().subscribe({
      next: (clients) => {
        this.clients.set(clients);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger la liste des utilisateurs.');
        this.chargement.set(false);
      },
    });
  }

  demanderConfirmation(client: ClientResponse): void {
    this.clientCible.set(client);
  }

  annulerConfirmation(): void {
    if (this.actionEnCours() !== null) return;
    this.clientCible.set(null);
  }

  confirmerBasculement(): void {
    const client = this.clientCible();
    if (!client) return;

    this.actionEnCours.set(client.id);

    const action$ = client.actif
      ? this.adminService.suspendreUtilisateur(client.id)
      : this.adminService.reactiverUtilisateur(client.id);

    action$.subscribe({
      next: (clientMisAJour) => {
        this.clients.update((list) =>
          list.map((c) => (c.id === clientMisAJour.id ? clientMisAJour : c)),
        );
        this.actionEnCours.set(null);
        this.clientCible.set(null);
      },
      error: () => {
        this.erreur.set('Erreur lors de la modification du statut du client.');
        this.actionEnCours.set(null);
        this.clientCible.set(null);
      },
    });
  }

  // Helper pour colorer le score (identique à la page des prêts)
  couleurScore(score: ScoreSolvabilite): string {
    switch (score) {
      case ScoreSolvabilite.EXCELLENT:
        return 'bg-primary-light text-primary-dark';
      case ScoreSolvabilite.BON:
        return 'bg-primary-light text-primary-dark';
      case ScoreSolvabilite.A_RISQUE:
        return 'bg-accent-light text-accent';
      case ScoreSolvabilite.MAUVAIS_PAYEUR:
        return 'bg-red-50 text-danger';
      default:
        return 'bg-bg text-ink-soft border border-border';
    }
  }
}
