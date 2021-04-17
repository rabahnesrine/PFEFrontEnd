import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GereUserComponent } from './gere-user.component';

describe('GereUserComponent', () => {
  let component: GereUserComponent;
  let fixture: ComponentFixture<GereUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GereUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GereUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
