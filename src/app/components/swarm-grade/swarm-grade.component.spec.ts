import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwarmGradeComponent } from './swarm-grade.component';

describe('SwarmGradeComponent', () => {
  let component: SwarmGradeComponent;
  let fixture: ComponentFixture<SwarmGradeComponent>;

  beforeEach(async(() => {
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
