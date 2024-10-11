import { __decorate } from "tslib";
import { Component } from '@angular/core';
let AsideComponent = class AsideComponent {
    constructor(asideService) {
        this.asideService = asideService;
        this.id_user = '';
        this.userName = '';
        this.salonPermiso = '';
        this.mostrarNegocios = false;
    }
    ngOnInit() {
        this.id_user = localStorage.getItem('usuarioId');
        if (this.id_user) {
            this.getUserName();
        }
        else {
            console.log('No userId found in localStorage');
        }
        // Verifica el permiso
        this.asideService.getUserPermiso().subscribe((response) => {
            //console.log('Permiso recibido:', response.permiso);
            if (response.permiso === 'salon') {
                this.salonPermiso = 'salon';
                this.mostrarNegocios = true;
                //console.log('mostrarNegocios se establece en true');
            }
            else if (response.permiso === 'admin') {
                this.salonPermiso = 'admin';
                this.mostrarNegocios = true;
                //console.log('mostrarNegocios se establece en true');
            }
            else {
                this.mostrarNegocios = false;
                //console.log('mostrarNegocios se establece en false');
            }
        }, (error) => {
            console.log('Error fetching permiso:', error);
        });
    }
    getUserName() {
        this.asideService.getUserName(this.id_user).subscribe((response) => {
            if (response && response.success) {
                if (response.data && response.data.length > 0) {
                    this.userName = response.data[0].name;
                }
                else {
                    console.error('No user name found in response data');
                }
            }
            else {
                console.error('Error: ', response.message);
            }
        }, (error) => {
            console.error('Error fetching user name:', error);
        });
    }
};
AsideComponent = __decorate([
    Component({
        selector: 'app-aside',
        templateUrl: './aside.component.html',
        styleUrls: ['./aside.component.scss']
    })
], AsideComponent);
export { AsideComponent };
//# sourceMappingURL=aside.component.js.map