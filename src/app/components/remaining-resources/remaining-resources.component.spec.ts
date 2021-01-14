import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RemainingResourcesComponent } from './remaining-resources.component';

describe('RemainingResourcesComponent', () => {
  let component: RemainingResourcesComponent;
  let fixture: ComponentFixture<RemainingResourcesComponent>;

  beforeEach(waitForAsync(() => {
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
