import { TestBed } from '@angular/core/testing';
import { postCreation } from '../../modelos/postCreation';
import { GetPost } from './get-post';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { pagination } from '../../modelos/pagination';
import { postModel } from '../../modelos/postModel';

describe('GetPost', () => {
  let service: GetPost;
  let mock: HttpTestingController
  const data: pagination<postModel> = {
    current: 1,
    total: 1,
    total_count: 2,
    next: null,
    previous: null,
    result:  [
      {
            "id": 2,
            "title": "asdad",
            "author": "breyner",
            "content": "sadada",
            "created_at": new Date(),
            "author_team": "default",
            "permissions": {is_public:1, authenticated:2, team:2},
            "like_count": 0,
            "comment_count": 0
        },
        {
            "id": 1,
            "title": "primer Post",
            "author": "breyner",
            "content": "asdasdawdasfrdfsgtdfhftyhgfjfghfgjfghjfhfjftfhjf",
            "created_at": new Date(),
            "author_team": "default",
            "permissions": {is_public:1, authenticated:2, team:2},
            "like_count": 1,
            "comment_count": 0
        }
    ]
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GetPost]
    });
    service = TestBed.inject(GetPost);
    mock = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    mock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should get the post well", () => {
    service.load().subscribe((res) => {
      expect(res.total_count).toBe(2)
      expect(res.result.length).toBe(2)
      const post = res.result[0];
      expect(post.title).toBe("asdad");
      expect(post.author).toBe("breyner");
      expect(post.like_count).toBe(0);
      expect(post.comment_count).toBe(0);
    })
    const req = mock.expectOne('http://127.0.0.1:8000/Post/');
    expect(req.request.method).toBe('GET');
    req.flush(data);
  })

  it("should handle a server error", () => {
    service.load().subscribe({
      next: () => fail("no entra"),
      error: (error) => {
        expect(error.status).toBe(500)
      }
    })
    const req = mock.expectOne('http://127.0.0.1:8000/Post/');
    req.flush('Error', { status: 500, statusText: "Internal Server Error" });
  })

    it("should load a specific page when pag is provided", () => {
    service.load(3).subscribe((res) => {
      expect(res.result.length).toBe(2);
    });

    const req = mock.expectOne(req =>
      req.url === 'http://127.0.0.1:8000/Post/' && req.params.get('page') === '3'
    );
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it("should load a single post by ID", () => {
    const postId = "1";
    const post = data.result[1];

    service.loadPost(postId).subscribe((res) => {
      expect(res.id).toBe(1);
      expect(res.title).toBe("primer Post");
    });

    const req = mock.expectOne('http://127.0.0.1:8000/Post/1/');
    expect(req.request.method).toBe('GET');
    req.flush(post);
  });

  it("should send a post", () => {
    const newPost: postCreation = {
      title: "Nuevo post",
      content: "Contenido",
      is_public: 1,
      authenticated: 2,
      team: 2
    };

    service.sendPost(newPost).subscribe((res) => {
      expect(res).toEqual({ success: true });
    });

    const req = mock.expectOne('http://127.0.0.1:8000/Post/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPost);
    req.flush({ success: true });
  });

  it("should delete a post", () => {
    const postId = 5;

    service.delete(postId).subscribe((res) => {
      expect(res).toEqual({ deleted: true });
    });

    const req = mock.expectOne('http://127.0.0.1:8000/Post/5/');
    expect(req.request.method).toBe('DELETE');
    req.flush({ deleted: true });
  });


});
