import { TestBed, inject } from '@angular/core/testing';

import { SwarmMetricsService } from './swarm-metrics.service';

describe('SwarmMetricsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SwarmMetricsService]
    });
  });

  it('should be created', inject([SwarmMetricsService], (service: SwarmMetricsService) => {
    expect(service).toBeTruthy();
  }));
});
