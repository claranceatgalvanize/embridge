import { TestBed } from '@angular/core/testing';

import { RouteActivatorService } from './route-activator.service';

describe('RouteActivatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouteActivatorService = TestBed.get(RouteActivatorService);
    expect(service).toBeTruthy();
  });
});
