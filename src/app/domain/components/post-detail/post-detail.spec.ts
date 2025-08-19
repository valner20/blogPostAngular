import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PostDetail } from './post-detail';
import { GetComments } from '../../../services/comments/get-comments';
import { commentsModel } from '../../../modelos/comments';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
describe('PostDetail', () => {
  let component: PostDetail;
  let fixture: ComponentFixture<PostDetail>;
  let commentService: jasmine.SpyObj<GetComments>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  const dummyComments: commentsModel[] = [
    { id: 1, post: 1, user: 'Alice', content: 'First!', created_at: new Date() },
    { id: 2, post: 1, user: 'Bob', content: 'Nice post', created_at: new Date() }
  ];

  beforeEach(async () => {
    commentService = jasmine.createSpyObj('GetComments', ['load', 'send']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    commentService.load.and.returnValue(of({
      current: 1,
      total_count: 2,
      total: 3,
      next: null,
      previous: null,
      result: dummyComments
    }));

    await TestBed.configureTestingModule({
      imports: [PostDetail, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: GetComments, useValue: commentService },
        DatePipe,
        {
          provide: MatSnackBar, useValue: mockSnackBar
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetail);
    component = fixture.componentInstance;
    component.snackbar = mockSnackBar
    component.post = { id: 42, comment_count: 0 } as any;
    component.logged = true;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create component and load initial comments', fakeAsync(() => {
    commentService.load.and.returnValue(
      of({ current: 1, total_count: 2, total: 1, next: null, previous: null, result: dummyComments })
    );

    fixture.detectChanges();
    tick();

    expect(component.comments.length).toBe(2);
    expect(component.totalComments).toBe(2);
    expect(commentService.load).toHaveBeenCalledWith(component.post.id, 1);
    const commentEls = fixture.debugElement.queryAll(By.css('.comment-card'));
    expect(commentEls.length).toBe(2);
  }));

  it('should send a new comment and reload comments', fakeAsync(() => {
    component.comment = 'Hello';
    commentService.send.and.returnValue(of({} as any));

    const updatedComments = [
      ...dummyComments,
      { id: 3, post: 42, user: 'helo', content: 'Hello', created_at: new Date() },
    ];

    commentService.load.and.returnValue(
      of({ current: 1, total_count: 3, total: 1, next: null, previous: null, result: updatedComments })
    );

    fixture.detectChanges();
    component.send();
    tick();

    expect(commentService.send).toHaveBeenCalledWith(component.post.id, 'Hello');
    expect(component.comment).toBe('');
    expect(component.comments.length).toBe(3);
    expect(component.post.comment_count).toBe(1);
  }));

  it('should clear comment on cancel', () => {
    component.comment = 'Test';
    component.cancel();
    expect(component.comment).toBe('');
  });

  it('should emit close event when onClose is called', () => {
      spyOn(component.close, 'emit');

      component.onClose();

      expect(component.close.emit).toHaveBeenCalledWith();
    });

    it('should load comments successfully', fakeAsync(() => {
      component.loadComments(1);
      tick();

      expect(component.currentPage).toBe(1);
      expect(component.totalComments).toBe(2);
      expect(component.totalPages).toBe(3);
      expect(component.comments).toEqual(dummyComments);
    }));

    it('should show snackbar when loadComments fails', fakeAsync(() => {
      commentService.load.and.returnValue(throwError(() => new Error('Network error')));

      component.loadComments(1);
      tick();

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'could not load comments.',
        'close',
        jasmine.objectContaining({
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar-error']
        })
      );
    }));
    it('should go to next page when nextPage is called and not on last page', () => {
      spyOn(component, 'loadComments');
      component.currentPage = 1;
      component.totalPages = 3;
      component.nextPage();

      expect(component.loadComments).toHaveBeenCalledWith(2);
    });

     it('should not go to next page when already on last page', () => {
      component.currentPage = 5;
      spyOn(component, 'loadComments');

      component.nextPage();

      expect(component.loadComments).not.toHaveBeenCalled();
    });

    it("should go back if prev is called", () => {
      component.currentPage = 1;
      spyOn(component, "loadComments")
      component.prevPage()
      expect(component.loadComments).not.toHaveBeenCalled()
    })

    it('should go to previous page when prevPage is called and not on first page', () => {
      spyOn(component, 'loadComments');
      component.currentPage = 3;
      component.totalPages = 5;

      component.prevPage();

      expect(component.loadComments).toHaveBeenCalledWith(2);
    });


    it('should not send comment if it is empty', () => {
      component.comment = '';
      component.send();
      expect(commentService.send).not.toHaveBeenCalled();
    });


    it('should show error snackbar if send fails', fakeAsync(() => {
  component.comment = 'Test fail';
  commentService.send.and.returnValue(throwError(() => new Error('send error')));

  component.send();
  tick(1500);

  expect(mockSnackBar.open).toHaveBeenCalled()
  expect(component.submiting).toBeFalse();
}));


});
