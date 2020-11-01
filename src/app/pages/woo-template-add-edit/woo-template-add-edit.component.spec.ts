import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WooTemplateAddEditComponent } from './woo-template-add-edit.component';

describe('WooTemplateAddEditComponent', () => {
  let component: WooTemplateAddEditComponent;
  let fixture: ComponentFixture<WooTemplateAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WooTemplateAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WooTemplateAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
