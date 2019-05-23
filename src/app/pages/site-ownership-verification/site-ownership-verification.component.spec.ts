import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteOwnershipVerificationComponent } from './site-ownership-verification.component';

describe('SiteOwnershipVerificationComponent', () => {
  let component: SiteOwnershipVerificationComponent;
  let fixture: ComponentFixture<SiteOwnershipVerificationComponent>;

  beforeEach(async(() => {
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
