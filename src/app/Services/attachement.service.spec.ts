import { TestBed } from '@angular/core/testing';

import { AttachementService } from './attachement.service';

describe('AttachementService', () => {
  let service: AttachementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttachementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
