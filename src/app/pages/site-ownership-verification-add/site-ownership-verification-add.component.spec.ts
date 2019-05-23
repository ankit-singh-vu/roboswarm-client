import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteOwnershipVerificationAddComponent } from './site-ownership-verification-add.component';

describe('SiteOwnershipVerificationAddComponent', () => {
  let component: SiteOwnershipVerificationAddComponent;
  let fixture: ComponentFixture<SiteOwnershipVerificationAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteOwnershipVerificationAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteOwnershipVerificationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
