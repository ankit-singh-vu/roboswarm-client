import { TestBed, inject } from '@angular/core/testing';

import { SiteOwnershipService } from './site-ownership.service';

describe('SiteOwnershipService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SiteOwnershipService]
    });
  });

  it('should be created', inject([SiteOwnershipService], (service: SiteOwnershipService) => {
    expect(service).toBeTruthy();
  }));
});
