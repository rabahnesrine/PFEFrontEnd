import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstWindowsComponent } from './first-windows.component';

describe('FirstWindowsComponent', () => {
  let component: FirstWindowsComponent;
  let fixture: ComponentFixture<FirstWindowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstWindowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstWindowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
