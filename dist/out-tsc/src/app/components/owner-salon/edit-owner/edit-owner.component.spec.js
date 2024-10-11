import { TestBed } from '@angular/core/testing';
import { EditOwnerComponent } from './edit-owner.component';
describe('EditOwnerComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditOwnerComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(EditOwnerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=edit-owner.component.spec.js.map