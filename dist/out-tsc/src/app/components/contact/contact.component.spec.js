import { TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact.component';
describe('ContactComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ContactComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(ContactComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=contact.component.spec.js.map