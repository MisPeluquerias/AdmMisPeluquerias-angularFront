import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactProffesionalComponent } from './contact-proffesional.component';

describe('ContactProffesionalComponent', () => {
  let component: ContactProffesionalComponent;
  let fixture: ComponentFixture<ContactProffesionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactProffesionalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactProffesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
