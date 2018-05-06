import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterMatchResultComponent } from './enter-match-result.component';

describe('EnterMatchResultComponent', () => {
  let component: EnterMatchResultComponent;
  let fixture: ComponentFixture<EnterMatchResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterMatchResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterMatchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
