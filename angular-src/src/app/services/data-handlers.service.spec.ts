import { TestBed, inject } from '@angular/core/testing';

import { DataHandlersService } from './data-handlers.service';

describe('DataHandlersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataHandlersService]
    });
  });

  it('should be created', inject([DataHandlersService], (service: DataHandlersService) => {
    expect(service).toBeTruthy();
  }));
});
