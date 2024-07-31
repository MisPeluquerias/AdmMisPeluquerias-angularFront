import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spanishDate'
})
export class SpanishDatePipe implements PipeTransform {

  transform(value: Date | string | number, ...args: unknown[]): string {
    const date = new Date(value);
    return new Intl.DateTimeFormat('es-ES', { dateStyle: 'full', timeStyle: 'short' }).format(date);
  }

}
