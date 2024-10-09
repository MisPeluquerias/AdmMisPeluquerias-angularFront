import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let FilterPipe = class FilterPipe {
    transform(items, searchText, isActive, estado) {
        if (!items)
            return [];
        if (!searchText && !isActive && !estado)
            return items;
        searchText = searchText.toLowerCase();
        return items.filter(item => {
            const matchesText = searchText ? item.nombre.toLowerCase().includes(searchText) : true;
            const matchesActive = isActive ? item.activo === isActive : true;
            const matchesEstado = estado ? item.estado === estado : true;
            return matchesText && matchesActive && matchesEstado;
        });
    }
};
FilterPipe = __decorate([
    Pipe({
        name: 'filter'
    })
], FilterPipe);
export { FilterPipe };
//# sourceMappingURL=filter.pipe.js.map