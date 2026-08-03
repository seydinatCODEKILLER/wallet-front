import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  LucideLandmark,
  LucideLoaderCircle,
  LucideCheck,
  LucideX,
  LucideShieldCheck,
} from '@lucide/angular';
import { FcfaPipe } from '../../../shared/pipes/fcfa.pipe';
import { AdminService } from '../../../core/services/admin.service';
import { PretResponse } from '../../../core/models/pret.model';
import { ScoreSolvabilite } from '../../../core/models/enums';

@Component({
  selector: 'app-prets-en-attente',
  imports: [
    DatePipe,
    FcfaPipe,
    LucideLandmark,
    LucideLoaderCircle,
    LucideCheck,
    LucideX,
    LucideShieldCheck,
  ],
  templateUrl: './prets-en-attente.component.html',
})
export class PretsEnAttenteComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  protected readonly chargement = signal(true);
  protected readonly erreur = signal<string | null>(null);
  protected readonly demandes = signal<PretResponse[]>([]);

  protected readonly actionEnCours = signal<{ id: number; type: 'valider' | 'rejeter' } | null>(
    null,
  );

  ngOnInit(): void {
    this.chargerDemandes();
  }

  chargerDemandes(): void {
    this.chargement.set(true);
    this.adminService.listerDemandesEnAttente().subscribe({
      next: (demandes) => {
        this.demandes.set(demandes);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger les demandes de prêt.');
        this.chargement.set(false);
      },
    });
  }

  valider(pret: PretResponse): void {
    this.actionEnCours.set({ id: pret.id, type: 'valider' });
    this.adminService.validerPret(pret.id).subscribe({
      next: () => {
        // On retire le prêt validé de la liste (mise à jour optimiste)
        this.demandes.update((list) => list.filter((p) => p.id !== pret.id));
        this.actionEnCours.set(null);
      },
      error: () => {
        this.erreur.set('Erreur lors de la validation du prêt.');
        this.actionEnCours.set(null);
      },
    });
  }

  rejeter(pret: PretResponse): void {
    this.actionEnCours.set({ id: pret.id, type: 'rejeter' });
    this.adminService.rejeterPret(pret.id).subscribe({
      next: () => {
        // On retire le prêt rejeté de la liste
        this.demandes.update((list) => list.filter((p) => p.id !== pret.id));
        this.actionEnCours.set(null);
      },
      error: () => {
        this.erreur.set('Erreur lors du rejet du prêt.');
        this.actionEnCours.set(null);
      },
    });
  }

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
