import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { panelGuard } from './panel.guard';

describe('panelGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => panelGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
