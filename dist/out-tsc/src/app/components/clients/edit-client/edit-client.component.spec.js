import { TestBed } from '@angular/core/testing';
import { EditClientComponent } from './edit-client.component';
describe('EditClientComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditClientComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(EditClientComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=edit-client.component.spec.js.map