import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestComboChartComponent } from './request-combo-chart.component';

describe('RequestComboChartComponent', () => {
  let component: RequestComboChartComponent;
  let fixture: ComponentFixture<RequestComboChartComponent>;

  beforeEach(async(() => {
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
