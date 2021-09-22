import { TestBed } from '@angular/core/testing';

import { EventServService } from './event-serv.service';

describe('EventServService', () => {
  let service: EventServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
