import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgJobsComponent } from './img-jobs.component';

describe('ImgJobsComponent', () => {
  let component: ImgJobsComponent;
  let fixture: ComponentFixture<ImgJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImgJobsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImgJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
