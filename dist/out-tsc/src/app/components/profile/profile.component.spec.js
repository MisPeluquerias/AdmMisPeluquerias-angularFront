import { TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
describe('ProfileComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProfileComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(ProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=profile.component.spec.js.map