import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AurComponent } from './aur.component';

describe('AurComponent', () => {
  let component: AurComponent;
  let fixture: ComponentFixture<AurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
