import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaceTeamPlayerComponent } from './replace-team-player.component';

describe('ReplaceTeamPlayerComponent', () => {
  let component: ReplaceTeamPlayerComponent;
  let fixture: ComponentFixture<ReplaceTeamPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplaceTeamPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplaceTeamPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
