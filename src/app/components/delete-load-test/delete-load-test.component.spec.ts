import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeleteLoadTestComponent } from './delete-load-test.component';

describe('DeleteLoadTestComponent', () => {
  let component: DeleteLoadTestComponent;
  let fixture: ComponentFixture<DeleteLoadTestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteLoadTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteLoadTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
