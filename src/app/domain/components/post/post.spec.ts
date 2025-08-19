import { auth } from './../../../modelos/auth';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Post } from './post';
import { CommonModule } from '@angular/common';
import { GetLikes } from '../../../services/likes/get-likes';
import { of } from 'rxjs';
import { postFinal } from '../../../modelos/postModel';
import { GetPost } from '../../../services/getPost/get-post';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
describe('Post', () => {
  let component: Post;
  let fixture: ComponentFixture<Post>;
  let service: jasmine.SpyObj<GetLikes>
  let postService: jasmine.SpyObj<GetPost>
  let snackbar: jasmine.SpyObj<MatSnackBar>

  let post: postFinal = {
    id:1,
    title: "hola",
    author:"sam",
    author_team: "avanzatech",
    content: "content",
    created_at: new Date(),
    permissions: {
      is_public:1,
      authenticated:2,
      team:2
    },
    like_count:  1,
    comment_count: 1,
    liked: {id: 1, bool: true}
  }

  beforeEach(async () => {
    service = jasmine.createSpyObj('GetLikes', ['delete', 'post', 'likesPerUser', 'loadLikesPag']);
    postService = jasmine.createSpyObj('GetPost', ['delete']);
    snackbar= jasmine.createSpyObj("MatSnackBar", ["open"])
    await TestBed.configureTestingModule({
      imports: [Post, CommonModule],
      providers: [{provide: GetLikes, useValue: service},
        {
          provide: GetPost, useValue: postService
        },
        {
          provide: MatSnackBar, useValue: snackbar
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Post);
    component = fixture.componentInstance;
    component.post = structuredClone(post)
    component.liked = { id: 1, bool: true };
    component.snackbar = snackbar
    fixture.detectChanges();
  });

    it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should remove like when you press the button and it's already liked", () => {
    service.delete.and.returnValue(of({}));
    component.giveLike();
    expect(service.delete).toHaveBeenCalledWith(1);
    expect(component.liked.bool).toBeFalse()
    expect(component.post.like_count).toBe(0);
  });

  it("should add like when it's not liked", () => {
    component.liked = {id: 0, bool: false};
    service.post.and.returnValue(of({
      id: 0,
      post:1,
      user: 1,
      username:"brey"
    }));


    component.giveLike();
    expect(service.post).toHaveBeenCalledWith(1);
    expect(component.liked.bool).toBe(true);
    expect(component.post.like_count).toBe(2);
  });

  it("should show likes and open the overlay", () => {
    component.overlay = false;
    service.loadLikesPag.and.returnValue(of({
      current: 1,
      total_count: 1,
      total: 1,
      next: null,
      previous: null,
      result: []
    }));
    component.showLikes();
    expect(service.loadLikesPag).toHaveBeenCalled();
    expect(component.overlay).toBeTrue();
  });

  it("should load the next page if it's available", () => {
    component.currentPage = 1;
    component.totalPages = 3;

    service.loadLikesPag.and.returnValue(of({
      current: 2,
      total_count: 10,
      total: 3,
      next: "",
      previous: "",
      result: []
    }));

    component.nextPage();
    expect(service.loadLikesPag).toHaveBeenCalledOnceWith(1, 2);
  });

  it("should not load next page if on last page", () => {
    component.currentPage = 3;
    component.totalPages = 3;
    component.nextPage();
    expect(service.loadLikesPag).not.toHaveBeenCalled();
  });

  it("should calculate correctly the start index and end index", () => {
    component.currentPage = 2;
    component.totalLikes = 20;
    expect(component.startIndex()).toBe(15);
    expect(component.endIndex()).toBe(20);
  });

  it("should load previous page if not on first", () => {
  component.currentPage = 2;
  service.loadLikesPag.and.returnValue(of({ current: 1, total_count: 1, total: 1, next: null, previous: null ,result: [] }));
  component.prevPage();
  expect(service.loadLikesPag).toHaveBeenCalledWith(1, 1);
});

it("should not load previous page if on first", () => {
  component.currentPage = 1;
  component.prevPage();
  expect(service.loadLikesPag).not.toHaveBeenCalled();
});

  it("should not allow write if user not logged", () => {
  component.logged = false;
  expect(component.canWrite(post.permissions)).toBeFalse();
});

it("should allow write if user is staff", () => {
  component.logged = true;
  localStorage.setItem("staff", "true");
  expect(component.canWrite(post.permissions)).toBeTrue();
  localStorage.removeItem("staff");
});

it("should allow write if user is author", () => {
  component.logged = true;
  localStorage.setItem("username", "sam");
  expect(component.canWrite(post.permissions)).toBeTrue();
  localStorage.removeItem("username");
});

it("should allow write if authenticated == 2", () => {
  component.logged = true;
  const customPost = {...post, permissions: {
    is_public:1,
    authenticated: 2,
    team:2
  }};
  expect(component.canWrite(customPost.permissions)).toBeTrue();
});

it("should allow write if team == 2 and same team", () => {
  component.logged = true;
  localStorage.setItem("team", "avanzatech");
  const customPost = post;
  customPost.permissions = {
    is_public:1,
    authenticated:2,
    team:2
  };
  expect(component.canWrite(customPost.permissions)).toBeTrue();
  localStorage.removeItem("team");
});

it("should not allow write if no condition met", () => {
  component.logged = false;
  const customPost = {...post, permissions: {is_public:0,
    authenticated:0,
    team:0}};
  expect(component.canWrite(customPost.permissions)).toBeFalsy();
});

  it('should delete post and show snackbar on success', fakeAsync(() => {
  const deleteSpy = spyOn(component as any, 'reloadPage');
  postService.delete.and.returnValue(of({}));

  component.confirm(1);
  tick(3000);

  expect(component['service'].delete).toHaveBeenCalledWith(1);
  expect(component['snackbar'].open).toHaveBeenCalled();
  expect(deleteSpy).toHaveBeenCalled();
}));

  it("should show modal when delete() is called", () => {
  component.delete();
  expect(component.show).toBeTrue();
});

it("should close modal when close() is called", () => {
  component.show = true;
  component.close();
  expect(component.show).toBeFalse();
});

  it('should show snackbar when loadLikes fails',fakeAsync( () => {
    service.loadLikesPag.and.returnValue(throwError(()=>new Error()))
    component.loadLikes();
    tick()

    expect(snackbar.open).toHaveBeenCalled();
  }));

  it('should show snackbar when delete fails in confirm', () => {
    postService.delete.and.returnValue(throwError(() => new Error("fail")))

    component.confirm(1);

    expect(snackbar.open).toHaveBeenCalled()
  });

    it('should set editing to false when closeUpdate is called', () => {
    component.editing = true;
    component.closeUpdate();
    expect(component.editing).toBeFalse();
  });

   it('should emit showDetail when handleExcerptClick is called with showMore', () => {
    const event = { target: document.createElement('button') } as any;
    event.target.classList.add('showMore');
    const emitSpy = spyOn(component.showDetail, 'emit');

    component.handleExcerptClick(event);

    expect(emitSpy).toHaveBeenCalled();
  });

    it('should not emit showDetail when handleExcerptClick target has no showMore class', () => {
    const event = { target: document.createElement('button') } as any;
    const emitSpy = spyOn(component.showDetail, 'emit');

    component.handleExcerptClick(event);

    expect(emitSpy).not.toHaveBeenCalled();
  });


it("should show likes and open the overlay", () => {
  component.overlay = false;
  service.loadLikesPag.and.returnValue(of({
    current: 1, total_count: 1, total: 1, next: null, previous: null, result: []
  }));
  component.showLikes();
  expect(service.loadLikesPag).toHaveBeenCalledWith(1, 1);
  expect(component.overlay).toBeTrue();
});


});
