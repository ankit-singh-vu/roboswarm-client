import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResponseTimeComboChartComponent } from './response-time-combo-chart.component';

describe('ResponseTimeComboChartComponent', () => {
  let component: ResponseTimeComboChartComponent;
  let fixture: ComponentFixture<ResponseTimeComboChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponseTimeComboChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseTimeComboChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
