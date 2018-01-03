import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentRegistrationIdComponent } from './tournament-registration-id.component';

describe('TournamentRegistrationIdComponent', () => {
  let component: TournamentRegistrationIdComponent;
  let fixture: ComponentFixture<TournamentRegistrationIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentRegistrationIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentRegistrationIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
