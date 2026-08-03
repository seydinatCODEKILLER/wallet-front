import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  LucideLandmark,
  LucideLoaderCircle,
  LucideCheck,
  LucideX,
  LucideShieldCheck,
} from '@lucide/angular';
import { FcfaPipe } from '../../../shared/pipes/fcfa.pipe';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import {
  ToggleVueComponent,
  OptionToggle,
} from '../../../shared/components/toggle-vue/toggle-vue.component';
import { AdminService } from '../../../core/services/admin.service';
import { PretResponse } from '../../../core/models/pret.model';
import { ScoreSolvabilite } from '../../../core/models/enums';

type TypeAction = 'valider' | 'rejeter';
type VueListe = 'tableau' | 'cartes';

@Component({
  selector: 'app-prets-en-attente',
  imports: [
    DatePipe,
    FcfaPipe,
    ConfirmationModalComponent,
    PaginationComponent,
    ToggleVueComponent,
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

  protected readonly actionEnCours = signal<{ id: number; type: TypeAction } | null>(null);

  // Prêt + action ciblés par la modale de confirmation (null = modale fermée)
  protected readonly cible = signal<{ pret: PretResponse; type: TypeAction } | null>(null);

  // Vue actuelle, pilotée par app-toggle-vue via [(valeur)]
  protected readonly vue = signal<VueListe>('tableau');
  protected readonly optionsVue: OptionToggle<VueListe>[] = [
    { valeur: 'tableau', label: 'Vue tableau', icone: 'list' },
    { valeur: 'cartes', label: 'Vue cartes', icone: 'grid' },
  ];

  // Page actuelle, pilotée par app-pagination via [(pageActuelle)]
  protected readonly pageActuelle = signal(1);
  private readonly taillePage = 8;

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.demandes().length / this.taillePage)),
  );

  protected readonly demandesPage = computed(() => {
    const debut = (this.pageActuelle() - 1) * this.taillePage;
    return this.demandes().slice(debut, debut + this.taillePage);
  });

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

  demanderConfirmation(pret: PretResponse, type: TypeAction): void {
    this.cible.set({ pret, type });
  }

  annulerConfirmation(): void {
    if (this.actionEnCours() !== null) return;
    this.cible.set(null);
  }

  confirmerAction(): void {
    const cible = this.cible();
    if (!cible) return;

    const { pret, type } = cible;
    this.actionEnCours.set({ id: pret.id, type });

    const action$ =
      type === 'valider'
        ? this.adminService.validerPret(pret.id)
        : this.adminService.rejeterPret(pret.id);

    action$.subscribe({
      next: () => {
        this.demandes.update((list) => list.filter((p) => p.id !== pret.id));
        this.actionEnCours.set(null);
        this.cible.set(null);

        if (this.demandesPage().length === 0 && this.pageActuelle() > 1) {
          this.pageActuelle.update((p) => p - 1);
        }
      },
      error: () => {
        this.erreur.set(
          type === 'valider'
            ? 'Erreur lors de la validation du prêt.'
            : 'Erreur lors du rejet du prêt.',
        );
        this.actionEnCours.set(null);
        this.cible.set(null);
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
