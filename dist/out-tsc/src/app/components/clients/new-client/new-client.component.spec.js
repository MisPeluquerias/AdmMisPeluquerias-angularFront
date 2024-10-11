import { TestBed } from '@angular/core/testing';
import { NewClientComponent } from './new-client.component';
describe('NewClientComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NewClientComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(NewClientComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=new-client.component.spec.js.map