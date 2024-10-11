import { TestBed } from '@angular/core/testing';
import { ExportComponent } from './export.component';
describe('ExportComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExportComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(ExportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=export.component.spec.js.map