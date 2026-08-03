import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LucideLandmark, LucidePlus, LucideChevronRight } from '@lucide/angular';
import { PretService } from '../../../../core/services/pret.service';
import { PretResponse } from '../../../../core/models/pret.model';
import { FcfaPipe } from '../../../../shared/pipes/fcfa.pipe';
import { BadgeStatutComponent } from '../../../../shared/components/badge-statut/badge-statut.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import {
  ToggleVueComponent,
  OptionToggle,
} from '../../../../shared/components/toggle-vue/toggle-vue.component';

type VueListe = 'cartes' | 'tableau';

@Component({
  selector: 'app-liste-prets',
  imports: [
    RouterLink,
    DatePipe,
    FcfaPipe,
    BadgeStatutComponent,
    PaginationComponent,
    ToggleVueComponent,
    LucideLandmark,
    LucidePlus,
    LucideChevronRight,
  ],
  templateUrl: './liste-prets.component.html',
})
export class ListePretsComponent implements OnInit {
  private readonly pretService = inject(PretService);

  protected readonly chargement = signal(true);
  protected readonly prets = signal<PretResponse[]>([]);

  // Vue actuelle, pilotée par app-toggle-vue via [(valeur)]
  protected readonly vue = signal<VueListe>('cartes');
  protected readonly optionsVue: OptionToggle<VueListe>[] = [
    { valeur: 'tableau', label: 'Vue tableau', icone: 'list' },
    { valeur: 'cartes', label: 'Vue cartes', icone: 'grid' },
  ];

  // Page actuelle, pilotée par app-pagination via [(pageActuelle)]
  protected readonly pageActuelle = signal(1);
  private readonly taillePage = 8;

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.prets().length / this.taillePage)),
  );

  protected readonly pretsPage = computed(() => {
    const debut = (this.pageActuelle() - 1) * this.taillePage;
    return this.prets().slice(debut, debut + this.taillePage);
  });

  ngOnInit(): void {
    this.pretService.mesPrets().subscribe({
      next: (prets) => {
        this.prets.set(prets);
        this.chargement.set(false);
      },
      error: () => this.chargement.set(false),
    });
  }
}
