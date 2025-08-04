import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';

import { interceptorInterceptor } from './interceptor-interceptor';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('interceptorInterceptor', () => {
  let http: HttpClient;
  let mock: HttpTestingController;
  let router: jasmine.SpyObj<Router>
  function fakeToken(payload: any): string {
  return `header.${JSON.stringify(payload)}.signature`;
}

  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => interceptorInterceptor(req, next));

  beforeEach(() => {
    router = jasmine.createSpyObj("Router", ["navigate"])
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideHttpClient(withInterceptors([interceptorInterceptor])),
      {provide: Router, useValue: router  }]
    });
    http = TestBed.inject(HttpClient);
    mock = TestBed.inject(HttpTestingController);
    localStorage.clear()
  });
  afterEach(()=>{
      mock.verify()
      localStorage.clear()
  })


  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });


});
