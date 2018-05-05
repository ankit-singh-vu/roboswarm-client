import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwarmTileComponent } from './swarm-tile.component';

describe('SwarmTileComponent', () => {
  let component: SwarmTileComponent;
  let fixture: ComponentFixture<SwarmTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwarmTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwarmTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
