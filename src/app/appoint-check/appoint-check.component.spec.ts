import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointCheckComponent } from './appoint-check.component';

describe('AppointCheckComponent', () => {
  let component: AppointCheckComponent;
  let fixture: ComponentFixture<AppointCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointCheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
