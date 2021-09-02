import { TestBed } from '@angular/core/testing';

import { CalandrieServService } from './calandrie-serv.service';

describe('CalandrieServService', () => {
  let service: CalandrieServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalandrieServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
