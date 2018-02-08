import { TestBed, inject } from '@angular/core/testing';

import { CasesV2Service } from './cases-v2.service';

describe('CasesV2Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CasesV2Service]
    });
  });

  it('should be created', inject([CasesV2Service], (service: CasesV2Service) => {
    expect(service).toBeTruthy();
  }));
});
