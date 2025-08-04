import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { guardGuard } from './guard-guard';

describe('guardGuard', () => {
    let mockRouter: jasmine.SpyObj<Router>;
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => guardGuard(...guardParameters));

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    });
    localStorage.clear();
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
  it('should allow access when no token is present', () => {
    const result = executeGuard({} as any, {} as any);
    expect(result).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should block access and navigate when token is present', () => {
    localStorage.setItem('access', 'fake-token');
    const result = executeGuard({} as any, {} as any);
    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });
});
