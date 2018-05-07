import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopLoadTestButtonComponent } from './stop-load-test-button.component';

describe('StopLoadTestButtonComponent', () => {
  let component: StopLoadTestButtonComponent;
  let fixture: ComponentFixture<StopLoadTestButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopLoadTestButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopLoadTestButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
