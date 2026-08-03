import { Component, input, model } from '@angular/core';
import { LucideList, LucideLayoutGrid, LucideTable, LucideCalendar } from '@lucide/angular';

export type IconeToggle = 'list' | 'grid' | 'table' | 'calendar';

export interface OptionToggle<T extends string> {
  valeur: T;
  label: string;
  icone?: IconeToggle;
}

@Component({
  selector: 'app-toggle-vue',
  imports: [LucideList, LucideLayoutGrid, LucideTable, LucideCalendar],
  templateUrl: './toggle-vue.component.html',
})
export class ToggleVueComponent<T extends string = string> {
  options = input.required<OptionToggle<T>[]>();
  valeur = model.required<T>();

  choisir(option: OptionToggle<T>): void {
    this.valeur.set(option.valeur);
  }
}
