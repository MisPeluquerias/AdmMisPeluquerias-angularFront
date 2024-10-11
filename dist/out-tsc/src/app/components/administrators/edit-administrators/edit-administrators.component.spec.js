import { TestBed } from '@angular/core/testing';
import { EditAdministratorsComponent } from './edit-administrators.component';
describe('EditAdministratorsComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditAdministratorsComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(EditAdministratorsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=edit-administrators.component.spec.js.map