import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwarmCreateComponent } from './swarm-create.component';

describe('SwarmCreateComponent', () => {
  let component: SwarmCreateComponent;
  let fixture: ComponentFixture<SwarmCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwarmCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwarmCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
