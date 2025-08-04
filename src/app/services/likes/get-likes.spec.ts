import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GetLikes } from './get-likes';
import { likes } from '../../modelos/likes';
import { pagination } from '../../modelos/pagination';

describe('GetLikes Service', () => {
  let service: GetLikes;
  let httpMock: HttpTestingController;

  const mockData: pagination<likes> = {
    current: 1,
    total: 1,
    total_count: 1,
    next: null,
    previous: null,
    result: [
      {
        id: 1,
        user: 1,
        post: 101,
        username:"a"
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GetLikes]
    });

    service = TestBed.inject(GetLikes);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should get likes', () => {
    service.loadAll().subscribe((res: pagination<likes>) => {
      expect(res.total_count).toBe(1);
      expect(res.result.length).toBe(1);
      expect(res.result[0].user).toBe(1);
      expect(res.result[0].post).toBe(101);
      expect(res.result[0].username).toBe("a");

    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/likes/');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should handle error server', () => {
    service.loadAll().subscribe({
      next: () => fail('No debería pasar por next'),
      error: (error: any) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/likes/');
    req.flush('Error del servidor', { status: 500, statusText: 'Server Error' });
  });

  it('should get paginated likes when page is provided', () => {
  service.loadLikesPag(101, 2).subscribe(res => {
    expect(res.total_count).toBe(1);
  });

  const req = httpMock.expectOne(r =>
    r.url === 'http://127.0.0.1:8000/likes/' && r.params.get('page') === '2' && r.params.get('post') === '101'
  );
  expect(req.request.method).toBe('GET');
  req.flush(mockData);
});

it('should get paginated likes when page is not provided', () => {
  service.loadLikesPag(101).subscribe(res => {
    expect(res.total_count).toBe(1);
  });

  const req = httpMock.expectOne('http://127.0.0.1:8000/likes/?post=101');
  expect(req.request.method).toBe('GET');
  req.flush(mockData);
}); 

});

