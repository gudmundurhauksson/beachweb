import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FortgotPasswordComponent } from './fortgot-password.component';

describe('FortgotPasswordComponent', () => {
  let component: FortgotPasswordComponent;
  let fixture: ComponentFixture<FortgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FortgotPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FortgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
