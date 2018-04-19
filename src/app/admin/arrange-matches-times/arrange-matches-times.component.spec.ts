import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrangeMatchesTimesComponent } from './arrange-matches-times.component';

describe('ArrangeMatchesTimesComponent', () => {
  let component: ArrangeMatchesTimesComponent;
  let fixture: ComponentFixture<ArrangeMatchesTimesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrangeMatchesTimesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrangeMatchesTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
