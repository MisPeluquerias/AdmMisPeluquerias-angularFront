import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdministratorsComponent } from './edit-administrators.component';

describe('EditAdministratorsComponent', () => {
  let component: EditAdministratorsComponent;
  let fixture: ComponentFixture<EditAdministratorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditAdministratorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditAdministratorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
