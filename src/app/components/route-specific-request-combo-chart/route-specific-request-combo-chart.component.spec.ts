import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RequestComboChartComponent } from './request-combo-chart.component';

describe('RequestComboChartComponent', () => {
  let component: RequestComboChartComponent;
  let fixture: ComponentFixture<RequestComboChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestComboChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestComboChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
