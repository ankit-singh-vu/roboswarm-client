import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VerifySiteOwnershipButtonComponent } from './verify-site-ownership-button.component';

describe('VerifySiteOwnershipButtonComponent', () => {
  let component: VerifySiteOwnershipButtonComponent;
  let fixture: ComponentFixture<VerifySiteOwnershipButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifySiteOwnershipButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifySiteOwnershipButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
