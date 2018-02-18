import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRegistrationsComponent } from './all-registrations.component';

describe('AllRegistrationsComponent', () => {
  let component: AllRegistrationsComponent;
  let fixture: ComponentFixture<AllRegistrationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllRegistrationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
