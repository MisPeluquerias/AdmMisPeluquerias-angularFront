import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerSalonComponent } from './owner-salon.component';

describe('OwnerSalonComponent', () => {
  let component: OwnerSalonComponent;
  let fixture: ComponentFixture<OwnerSalonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OwnerSalonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OwnerSalonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
