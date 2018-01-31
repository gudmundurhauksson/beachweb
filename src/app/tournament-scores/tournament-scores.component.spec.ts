import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentScoresComponent } from './tournament-scores.component';

describe('TournamentScoresComponent', () => {
  let component: TournamentScoresComponent;
  let fixture: ComponentFixture<TournamentScoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentScoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
