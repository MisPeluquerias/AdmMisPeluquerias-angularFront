import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let SpanishDatePipe = class SpanishDatePipe {
    transform(value, ...args) {
        const date = new Date(value);
        return new Intl.DateTimeFormat('es-ES', { dateStyle: 'full', timeStyle: 'short' }).format(date);
    }
};
SpanishDatePipe = __decorate([
    Pipe({
        name: 'spanishDate'
    })
], SpanishDatePipe);
export { SpanishDatePipe };
//# sourceMappingURL=spanish-date.pipe.js.map