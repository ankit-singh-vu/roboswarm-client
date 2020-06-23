import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordpressRouteComponent } from './wordpress-route.component';

describe('WordpressRouteComponent', () => {
  let component: WordpressRouteComponent;
  let fixture: ComponentFixture<WordpressRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordpressRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordpressRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
