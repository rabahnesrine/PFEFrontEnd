import { TestBed } from '@angular/core/testing';

import { ProjetServService } from './projet-serv.service';

describe('ProjetServService', () => {
  let service: ProjetServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjetServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
