import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseTimeComboChartComponent } from './response-time-combo-chart.component';

describe('ResponseTimeComboChartComponent', () => {
  let component: ResponseTimeComboChartComponent;
  let fixture: ComponentFixture<ResponseTimeComboChartComponent>;

  beforeEach(async(() => {
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
