import { TestBed } from '@angular/core/testing';

import { TalkerService } from './talker.service';

describe('TalkerService', () => {
  let service: TalkerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TalkerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
