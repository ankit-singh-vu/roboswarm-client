import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTemplateRoutesModalComponent } from './edit-template-routes-modal.component';

describe('EditTemplateRoutesModalComponent', () => {
  let component: EditTemplateRoutesModalComponent;
  let fixture: ComponentFixture<EditTemplateRoutesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTemplateRoutesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTemplateRoutesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
