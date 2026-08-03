import { Component, input, model, computed } from '@angular/core';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';

@Component({
  selector: 'app-pagination',
  imports: [LucideChevronLeft, LucideChevronRight],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  pageActuelle = model.required<number>();
  totalPages = input.required<number>();

  protected readonly estPremierePage = computed(() => this.pageActuelle() === 1);
  protected readonly estDernierePage = computed(() => this.pageActuelle() === this.totalPages());

  precedente(): void {
    if (!this.estPremierePage()) {
      this.pageActuelle.update((p) => p - 1);
    }
  }

  suivante(): void {
    if (!this.estDernierePage()) {
      this.pageActuelle.update((p) => p + 1);
    }
  }
}
