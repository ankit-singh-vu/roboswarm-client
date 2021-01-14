import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SwarmDetailComponent } from './swarm-detail.component';

describe('SwarmDetailComponent', () => {
  let component: SwarmDetailComponent;
  let fixture: ComponentFixture<SwarmDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SwarmDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwarmDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
