import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppComponent } from './app.component';
let AppServerModule = class AppServerModule {
};
AppServerModule = __decorate([
    NgModule({
        imports: [
            ServerModule,
        ],
        bootstrap: [AppComponent],
    })
], AppServerModule);
export { AppServerModule };
//# sourceMappingURL=app.module.server.js.map