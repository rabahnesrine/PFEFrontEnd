import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JwPaginationComponent } from './jw-pagination.component';

describe('JwPaginationComponent', () => {
  let component: JwPaginationComponent;
  let fixture: ComponentFixture<JwPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JwPaginationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JwPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
