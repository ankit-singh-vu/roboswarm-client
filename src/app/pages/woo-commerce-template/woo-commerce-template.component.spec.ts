import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WooCommerceTemplateComponent } from './woo-commerce-template.component';

describe('WooCommerceTemplateComponent', () => {
  let component: WooCommerceTemplateComponent;
  let fixture: ComponentFixture<WooCommerceTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WooCommerceTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WooCommerceTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
