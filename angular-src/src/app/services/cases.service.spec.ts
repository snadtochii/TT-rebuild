/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CasesService } from './cases.service';

describe('CasesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CasesService]
    });
  });

  it('should ...', inject([CasesService], (service: CasesService) => {
    expect(service).toBeTruthy();
  }));
});
