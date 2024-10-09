import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let SearchTablePipe = class SearchTablePipe {
    transform(value, args) {
        if (!value)
            return null;
        if (!args)
            return value;
        args = args.toLowerCase();
        return value.filter((item) => {
            return JSON.stringify(item).toLowerCase().includes(args);
        });
    }
};
SearchTablePipe = __decorate([
    Pipe({
        name: 'searchTable'
    })
], SearchTablePipe);
export { SearchTablePipe };
//# sourceMappingURL=search-table.pipe.js.map