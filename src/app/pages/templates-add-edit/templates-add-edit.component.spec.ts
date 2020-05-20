import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesAddEditComponent } from './templates-add-edit.component';

describe('TemplatesAddEditComponent', () => {
  let component: TemplatesAddEditComponent;
  let fixture: ComponentFixture<TemplatesAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
