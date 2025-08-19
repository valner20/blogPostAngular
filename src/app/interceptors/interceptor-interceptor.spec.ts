import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { interceptorInterceptor } from './interceptor-interceptor';


describe('interceptorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([interceptorInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });


  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should pass request if no access token', () => {
    http.get('/test').subscribe();
    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('should add Authorization header if access token is valid', () => {
    const payload = { exp: Math.floor(Date.now() / 1000) + 3600 };
    const validToken = btoa(JSON.stringify({ alg: 'aaaa' })) + '.' + btoa(JSON.stringify(payload)) ;
    localStorage.setItem('access', validToken);
    http.get('/test').subscribe();
    const req = httpMock.expectOne('/test');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${validToken}`);
    req.flush({});
  });


  it('should refresh access token if expired and refresh valid', () => {
    const expiredPayload = { exp: Math.floor(Date.now() / 1000) - 3600 };
    const validPayload = { exp: Math.floor(Date.now() / 1000) + 3600 };
    const expiredToken = btoa(JSON.stringify({ alg: 'aaaaaaa' })) + '.' + btoa(JSON.stringify(expiredPayload));
    const validRefreshToken = btoa(JSON.stringify({ alg: 'aaaaaaa' })) + '.' + btoa(JSON.stringify(validPayload));
    localStorage.setItem('access', expiredToken);
    localStorage.setItem('refresh', validRefreshToken);
    http.get('/test').subscribe();
    const refreshReq = httpMock.expectOne('http://127.0.0.1:8000/api/token/refresh/');

    expect(refreshReq.request.method).toBe('POST');
    expect(refreshReq.request.body).toEqual({ refresh: validRefreshToken });

    const newValidPayload = { exp: Math.floor(Date.now() / 1000) + 3600 };
    const newToken = btoa(JSON.stringify({ alg: 'aaaaaaa' })) + '.' + btoa(JSON.stringify(newValidPayload));;
    refreshReq.flush({ access: newToken });
    const req = httpMock.expectOne('/test');

    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${newToken}`);

    req.flush({});
  });


  it('should clear storage if refresh token expired', () => {
    const expiredPayload = { exp: Math.floor(Date.now() / 1000) - 3600 };
    const expiredAccessToken =  btoa(JSON.stringify({ alg: 'aaaaaaa' })) + '.' + btoa(JSON.stringify(expiredPayload));
    const expiredRefreshToken = btoa(JSON.stringify({ alg: 'aaaaaaa' })) + '.' + btoa(JSON.stringify(expiredPayload));
    localStorage.setItem('access', expiredAccessToken);
    localStorage.setItem('refresh', expiredRefreshToken);
    http.get('/test').subscribe();
    const req = httpMock.expectOne('/test');

    expect(req.request.headers.has('Authorization')).toBeFalse();
    expect(localStorage.getItem('access')).toBeNull();
    expect(localStorage.getItem('refresh')).toBeNull();
    req.flush({});
  });



  it('should skip interception for /token/refresh/', () => {
    const validPayload = { exp: Math.floor(Date.now() / 1000) + 3600 };
    const validToken = btoa(JSON.stringify(validPayload)) ;
    localStorage.setItem('access', validToken);
    http.post('/token/refresh/', {}).subscribe();
    const req = httpMock.expectOne('/token/refresh/');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });



  it('should proceed without auth if no refresh token when access expired', () => {
    const expiredPayload = { exp: Math.floor(Date.now() / 1000) - 3600 };
    const expiredToken = btoa(JSON.stringify({ alg: 'aaaaaa' })) + '.' + btoa(JSON.stringify(expiredPayload));
    localStorage.setItem('access', expiredToken);
    http.get('/test').subscribe();
    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

});
