import { TestBed } from '@angular/core/testing';
import { CategoriesComponent } from './categories.component';
describe('CategoriesComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CategoriesComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(CategoriesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=categories.component.spec.js.map