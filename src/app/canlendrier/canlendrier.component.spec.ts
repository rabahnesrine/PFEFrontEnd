import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanlendrierComponent } from './canlendrier.component';

describe('CanlendrierComponent', () => {
  let component: CanlendrierComponent;
  let fixture: ComponentFixture<CanlendrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanlendrierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanlendrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
