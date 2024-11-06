import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesJobsComponent } from './categories-jobs.component';

describe('CategoriesJobsComponent', () => {
  let component: CategoriesJobsComponent;
  let fixture: ComponentFixture<CategoriesJobsComponent>;

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
