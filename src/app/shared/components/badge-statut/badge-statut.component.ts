import { Component, input, computed } from '@angular/core';

type StatutConnu = 'EN_ATTENTE' | 'VALIDE' | 'REJETE' | 'SOLDE' | 'A_PAYER' | 'PAYE' | 'RETARD';

interface StyleStatut {
  label: string;
  classes: string;
}

const STYLES: Record<StatutConnu, StyleStatut> = {
  EN_ATTENTE: { label: 'En attente', classes: 'bg-accent-light text-accent' },
  VALIDE: { label: 'Validé', classes: 'bg-primary-light text-primary-dark' },
  REJETE: { label: 'Rejeté', classes: 'bg-red-50 text-danger' },
  SOLDE: { label: 'Soldé', classes: 'bg-ink/5 text-ink-soft' },
  A_PAYER: { label: 'À payer', classes: 'bg-bg text-ink-soft border border-border' },
  PAYE: { label: 'Payée', classes: 'bg-primary-light text-primary-dark' },
  RETARD: { label: 'En retard', classes: 'bg-red-50 text-danger' },
};

@Component({
  selector: 'app-badge-statut',
  template: `
    <span
      class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
      [class]="style().classes"
    >
      {{ style().label }}
    </span>
  `,
})
export class BadgeStatutComponent {
  statut = input.required<string>();

  protected readonly style = computed<StyleStatut>(
    () =>
      STYLES[this.statut() as StatutConnu] ?? {
        label: this.statut(),
        classes: 'bg-bg text-ink-soft',
      },
  );
}
