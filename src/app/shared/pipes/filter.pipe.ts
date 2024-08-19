import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string, isActive: string, estado: string): any[] {
    if (!items) return [];
    if (!searchText && !isActive && !estado) return items;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      const matchesText = searchText ? item.nombre.toLowerCase().includes(searchText) : true;
      const matchesActive = isActive ? item.activo === isActive : true;
      const matchesEstado = estado ? item.estado === estado : true;
      return matchesText && matchesActive && matchesEstado;
    });
  }
}
