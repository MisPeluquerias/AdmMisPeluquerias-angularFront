import { TestBed } from '@angular/core/testing';
import { NewHomeComponent } from './new-home.component';
describe('NewHomeComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NewHomeComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(NewHomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=new-home.component.spec.js.map