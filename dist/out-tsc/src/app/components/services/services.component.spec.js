import { TestBed } from '@angular/core/testing';
import { ServicesComponent } from './services.component';
describe('ServicesComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ServicesComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(ServicesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=services.component.spec.js.map