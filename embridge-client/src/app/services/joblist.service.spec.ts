import { TestBed } from '@angular/core/testing';

import { JoblistService } from './joblist.service';

describe('JoblistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JoblistService = TestBed.get(JoblistService);
    expect(service).toBeTruthy();
  });
});
