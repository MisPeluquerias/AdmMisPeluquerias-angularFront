import { TestBed } from '@angular/core/testing';
import { CategoriesJobsComponent } from './categories-jobs.component';
describe('CategoriesJobsComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CategoriesJobsComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(CategoriesJobsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=categories-jobs.component.spec.js.map