import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavigationLinksComponent } from './navigation-links.component';

describe('NavigationLinksComponent', () => {
  let component: NavigationLinksComponent;
  let fixture: ComponentFixture<NavigationLinksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
