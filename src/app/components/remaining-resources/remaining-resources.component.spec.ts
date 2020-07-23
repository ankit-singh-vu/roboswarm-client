import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemainingResourcesComponent } from './remaining-resources.component';

describe('RemainingResourcesComponent', () => {
  let component: RemainingResourcesComponent;
  let fixture: ComponentFixture<RemainingResourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemainingResourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemainingResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
