import { TestBed } from '@angular/core/testing';
import { ReclamationsComponent } from './reclamations.component';
describe('ReclamationsComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ReclamationsComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(ReclamationsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=reclamations.component.spec.js.map