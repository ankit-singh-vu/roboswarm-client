import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocustWebUiComponent } from './locust-web-ui.component';

describe('LocustWebUiComponent', () => {
  let component: LocustWebUiComponent;
  let fixture: ComponentFixture<LocustWebUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocustWebUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocustWebUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
