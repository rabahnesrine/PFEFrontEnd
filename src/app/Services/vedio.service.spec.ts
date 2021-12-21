import { TestBed } from '@angular/core/testing';

import { VedioService } from './vedio.service';

describe('VedioService', () => {
  let service: VedioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VedioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
