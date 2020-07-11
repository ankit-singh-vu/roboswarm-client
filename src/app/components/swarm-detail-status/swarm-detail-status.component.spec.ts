import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwarmDetailStatusComponent } from './swarm-detail-status.component';

describe('SwarmDetailStatusComponent', () => {
  let component: SwarmDetailStatusComponent;
  let fixture: ComponentFixture<SwarmDetailStatusComponent>;

  beforeEach(async(() => {
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
