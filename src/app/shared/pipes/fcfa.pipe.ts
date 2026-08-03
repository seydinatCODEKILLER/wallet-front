import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fcfa' })
export class FcfaPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '0';
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value);
  }
}
