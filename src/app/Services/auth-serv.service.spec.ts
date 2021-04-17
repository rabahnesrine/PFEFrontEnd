import { TestBed } from '@angular/core/testing';

import { AuthServService } from './auth-serv.service';

describe('AuthServService', () => {
  let service: AuthServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
