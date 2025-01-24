import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocsInfoComponent } from './docs-info.component';

describe('DocsInfoComponent', () => {
  let component: DocsInfoComponent;
  let fixture: ComponentFixture<DocsInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
