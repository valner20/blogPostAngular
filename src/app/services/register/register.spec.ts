import { TestBed } from '@angular/core/testing';
import { RegisterService } from './register';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { register } from '../../modelos/registro';
describe('Register', () => {
  let service: RegisterService;
  let mock: HttpTestingController
  let mockData:register = {
    username: "nombre",
    email: "email@gomali",
    password: "1234"
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RegisterService]
    });
    service = TestBed.inject(RegisterService);
    mock = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    mock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should send Post with information", () => {
    service.register(mockData).subscribe((data) => {
      expect(data).toEqual(mockData)
    })
    const req = mock.expectOne('http://127.0.0.1:8000/register/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    expect(req.request.headers.has("Authorization")).toBeFalse()
    req.flush(mockData);

  })

  it("should handle multiple registers", () => {
    service.register(mockData).subscribe()
    service.register(mockData).subscribe()
    const requests = mock.match('http://127.0.0.1:8000/register/');
    expect(requests.length).toBe(2);
    requests.forEach(req => {
      expect(req.request.method).toBe("POST")
      req.flush(mockData)
    })

  })


});
