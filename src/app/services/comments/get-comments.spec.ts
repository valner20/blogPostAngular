import { TestBed } from '@angular/core/testing';
import { GetComments } from './get-comments';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
describe('GetComments', () => {
  let service: GetComments;
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GetComments]
    });
    service = TestBed.inject(GetComments);
    httpMock = TestBed.inject(HttpTestingController)
  });

    afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should get comments with correct params", () => {
    const mockResponse = {
      current: 1,
      total: 1,
      total_count: 2,
      next: null,
      previous: null,
      result: [
        { id: 1,
           post: 2,
           user: "brey",
           content: 'Comentario',
           created_at: new Date() }
      ]
    };

    service.load(2, 1).subscribe(data => {
      expect(data).toEqual(mockResponse);
  })
  const req = httpMock.expectOne(req =>
      req.method === 'GET' &&
      req.url === 'http://127.0.0.1:8000/comment/' &&
      req.params.get('post') === '2' &&
      req.params.get('page') === '1'
    );

    req.flush(mockResponse);
});

  it("should send comment with correct info", () => {
    let mockComment = { id: 1, content: 'Nuevo comentario', post: 2 };
    let payload = { post: 2, content: 'Nuevo comentario' };

    service.send(2, 'Nuevo comentario').subscribe(data => {
      expect(data).toEqual(mockComment);
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/comment/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush(mockComment);
  })

})
