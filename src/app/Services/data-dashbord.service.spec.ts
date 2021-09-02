import { TestBed } from '@angular/core/testing';

import { DataDashbordService } from './data-dashbord.service';

describe('DataDashbordService', () => {
  let service: DataDashbordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataDashbordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
