import { TestBed } from '@angular/core/testing';
import { AsideComponent } from './aside.component';
describe('AsideComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AsideComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(AsideComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=aside.component.spec.js.map