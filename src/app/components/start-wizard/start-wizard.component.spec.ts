import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StartWizardComponent } from './start-wizard.component';

describe('StartWizardComponent', () => {
  let component: StartWizardComponent;
  let fixture: ComponentFixture<StartWizardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StartWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
