import { Component, input, output } from '@angular/core';
import { LucideTriangleAlert, LucideCircleHelp, LucideLoaderCircle } from '@lucide/angular';

export type VarianteModal = 'danger' | 'primaire';

@Component({
  selector: 'app-confirmation-modal',
  imports: [LucideTriangleAlert, LucideCircleHelp, LucideLoaderCircle],
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent {
  ouvert = input.required<boolean>();
  titre = input.required<string>();
  message = input.required<string>();
  texteConfirmer = input<string>('Confirmer');
  texteAnnuler = input<string>('Annuler');
  variante = input<VarianteModal>('primaire');
  chargement = input<boolean>(false);

  confirmer = output<void>();
  annuler = output<void>();

  onFermeture(): void {
    if (!this.chargement()) {
      this.annuler.emit();
    }
  }

  onConfirmer(): void {
    this.confirmer.emit();
  }
}
