import { TestBed } from '@angular/core/testing';
import { BrandsComponent } from './brands.component';
describe('BrandsComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BrandsComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(BrandsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=brands.component.spec.js.map