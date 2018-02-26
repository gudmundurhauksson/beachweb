import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrangeMatchesComponent } from './arrange-matches.component';

describe('ArrangeMatchesComponent', () => {
  let component: ArrangeMatchesComponent;
  let fixture: ComponentFixture<ArrangeMatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrangeMatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrangeMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
