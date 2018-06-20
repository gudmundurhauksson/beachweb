import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimemasterComponent } from './timemaster.component';

describe('TimemasterComponent', () => {
  let component: TimemasterComponent;
  let fixture: ComponentFixture<TimemasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimemasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
