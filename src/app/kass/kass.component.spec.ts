import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KassComponent } from './kass.component';

describe('KassComponent', () => {
  let component: KassComponent;
  let fixture: ComponentFixture<KassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
