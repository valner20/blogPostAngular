import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LoginService } from './login';
import { loginInterface } from '../../modelos/login';
import { auth } from '../../modelos/auth';

describe('Login', () => {
  let service: LoginService;
  let mock: HttpTestingController;
  const data: loginInterface = {
    email: "nombresito@gmail",
    password: "contraseñita"
  }
   const mockResponse: auth = {
    access: 'access-token',
    refresh: 'refresh-token',
    username: 'nombresito',
    team :"def",
    staff :"true"
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService]
    });
    service = TestBed.inject(LoginService);
    mock = TestBed.inject(HttpTestingController)
    localStorage.clear()
  });

  afterEach(()=>{
    mock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it("should login and save token", () => {
    service.login(data).subscribe(() => {
      expect(localStorage.getItem("access")? true : false).toBeTrue
      expect(localStorage.getItem("refresh")? true : false).toBeTrue
      expect(localStorage.getItem("username")? true : false).toBeTrue
    })
     const req = mock.expectOne("http://127.0.0.1:8000/api/token/");
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);
    req.flush(mockResponse);
  })

  it("should handle bad info", () =>{
    service.login(data).subscribe({
      next: () =>fail("error en los datos"),
      error: (error) => {
        expect(error.status).toBe(403);
        expect(localStorage.getItem("access")).toBeNull()
      }
    })
    const req = mock.expectOne("http://127.0.0.1:8000/api/token/");
    req.flush({ detail: "correo o contraseña incorrectos" }, { status: 403, statusText: "Forbidden" })

  })
});
