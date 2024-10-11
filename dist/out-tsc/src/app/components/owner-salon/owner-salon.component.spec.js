import { TestBed } from '@angular/core/testing';
import { OwnerSalonComponent } from './owner-salon.component';
describe('OwnerSalonComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OwnerSalonComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(OwnerSalonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=owner-salon.component.spec.js.map