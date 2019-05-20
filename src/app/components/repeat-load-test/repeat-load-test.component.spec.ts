import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatLoadTestComponent } from './repeat-load-test.component';

describe('RepeatLoadTestComponent', () => {
  let component: RepeatLoadTestComponent;
  let fixture: ComponentFixture<RepeatLoadTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepeatLoadTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatLoadTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
