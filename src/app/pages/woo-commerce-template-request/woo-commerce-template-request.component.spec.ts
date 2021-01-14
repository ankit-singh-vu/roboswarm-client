import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WooCommerceTemplateRequestComponent } from './woo-commerce-template-request.component';

describe('WooCommerceTemplateRequestComponent', () => {
  let component: WooCommerceTemplateRequestComponent;
  let fixture: ComponentFixture<WooCommerceTemplateRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WooCommerceTemplateRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WooCommerceTemplateRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
