import { TestBed } from '@angular/core/testing';
import { EditCityComponent } from './edit-city.component';
describe('EditCityComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditCityComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(EditCityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=edit-city.component.spec.js.map