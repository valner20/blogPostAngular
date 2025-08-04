import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PostDetail } from './post-detail';
import { GetComments } from '../../../services/comments/get-comments';
import { commentsModel } from '../../../modelos/comments';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('PostDetail', () => {
  let component: PostDetail;
  let fixture: ComponentFixture<PostDetail>;
  let commentService: jasmine.SpyObj<GetComments>;

  const dummyComments: commentsModel[] = [
    { id: 1, post: 1, user: 'Alice', content: 'First!', created_at: new Date() },
    { id: 2, post: 1, user: 'Bob', content: 'Nice post', created_at: new Date() }
  ];

  beforeEach(async () => {
    commentService = jasmine.createSpyObj('GetComments', ['load', 'send']);

    await TestBed.configureTestingModule({
      imports: [PostDetail, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: GetComments, useValue: commentService },
        DatePipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetail);
    component = fixture.componentInstance;
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
});
