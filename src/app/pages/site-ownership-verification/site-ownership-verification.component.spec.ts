import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SiteOwnershipVerificationComponent } from './site-ownership-verification.component';

describe('SiteOwnershipVerificationComponent', () => {
  let component: SiteOwnershipVerificationComponent;
  let fixture: ComponentFixture<SiteOwnershipVerificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteOwnershipVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteOwnershipVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
