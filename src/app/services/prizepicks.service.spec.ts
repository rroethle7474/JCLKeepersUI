import { TestBed } from '@angular/core/testing';

import { PrizepicksService } from './prizepicks.service';

describe('PrizepicksService', () => {
  let service: PrizepicksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrizepicksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
