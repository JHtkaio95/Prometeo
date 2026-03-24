import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { panelAdminGuard } from './panel-admin.guard';

describe('panelAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => panelAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
