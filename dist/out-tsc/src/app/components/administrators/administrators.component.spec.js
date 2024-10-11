import { TestBed } from '@angular/core/testing';
import { AdministratorsComponent } from './administrators.component';
describe('AdministratorsComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdministratorsComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(AdministratorsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=administrators.component.spec.js.map