import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LucideLandmark, LucidePlus, LucideInbox, LucideChevronRight } from '@lucide/angular';
import { PretService } from '../../../../core/services/pret.service';
import { PretResponse } from '../../../../core/models/pret.model';
import { FcfaPipe } from '../../../../shared/pipes/fcfa.pipe';
import { BadgeStatutComponent } from '../../../../shared/components/badge-statut/badge-statut.component';

@Component({
  selector: 'app-liste-prets',
  imports: [
    RouterLink,
    DatePipe,
    FcfaPipe,
    BadgeStatutComponent,
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
