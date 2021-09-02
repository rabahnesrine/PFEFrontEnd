import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatuserComponent } from './chatuser.component';

describe('ChatuserComponent', () => {
  let component: ChatuserComponent;
  let fixture: ComponentFixture<ChatuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatuserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
