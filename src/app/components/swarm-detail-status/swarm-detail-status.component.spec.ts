import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SwarmDetailStatusComponent } from './swarm-detail-status.component';

describe('SwarmDetailStatusComponent', () => {
  let component: SwarmDetailStatusComponent;
  let fixture: ComponentFixture<SwarmDetailStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SwarmDetailStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwarmDetailStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
