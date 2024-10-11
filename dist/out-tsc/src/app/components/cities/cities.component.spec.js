import { TestBed } from '@angular/core/testing';
import { CitiesComponent } from './cities.component';
describe('CitiesComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CitiesComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(CitiesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=cities.component.spec.js.map