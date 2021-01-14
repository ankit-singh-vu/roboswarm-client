import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SwarmGradeComponent } from './swarm-grade.component';

describe('SwarmGradeComponent', () => {
  let component: SwarmGradeComponent;
  let fixture: ComponentFixture<SwarmGradeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SwarmGradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwarmGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
