import { TestBed } from '@angular/core/testing';
import { ContactProffesionalComponent } from './contact-proffesional.component';
describe('ContactProffesionalComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ContactProffesionalComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(ContactProffesionalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=contact-proffesional.component.spec.js.map