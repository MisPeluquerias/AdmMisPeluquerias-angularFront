import { TestBed } from '@angular/core/testing';
import { EditHomeComponent } from './edit-home.component';
describe('EditHomeComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditHomeComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(EditHomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=edit-home.component.spec.js.map