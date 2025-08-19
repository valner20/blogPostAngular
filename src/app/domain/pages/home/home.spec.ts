  import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
  import { of } from 'rxjs';
  import { Home } from './home';
  import { GetPost } from '../../../services/getPost/get-post';
  import { GetLikes } from '../../../services/likes/get-likes';
  import { CommonModule } from '@angular/common';
  import { postModel } from '../../../modelos/postModel';
  import { likes } from '../../../modelos/likes';
  import { ActivatedRoute } from '@angular/router';
  import { HttpClientTestingModule } from '@angular/common/http/testing';
  import { LoginService } from '../../../services/login-logout/login-logout';
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { throwError } from 'rxjs';
  import { Location } from '@angular/common';

  describe('Home', () => {
    let component: Home;
    let fixture: ComponentFixture<Home>;
    let getmockPost: jasmine.SpyObj<GetPost>
    let mockLoginService: jasmine.SpyObj<LoginService>;
    let getmockLikes: jasmine.SpyObj<GetLikes>
    let mockLocation: jasmine.SpyObj<Location>;
    let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
    let mockActivatedRoute: any;
    const mockPost: postModel[]= [
      {
              id: 10,
              title: "asdasdaasedadaasdada",
              author: "breyner",
              content: "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit semper vel class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos orci varius natoque penatibus et magnis dis parturient montes nascetur ridiculus mus donec rhoncus eros lobortis nulla molestie mattis scelerisque maximus eget fermentum odio phasellus non purus est efficitur laoreet mauris pharetra vestibulum fusce dictum risus blandit quis suspendisse aliquet nisi sodales consequat magna ante condimentum neque at luctus nibh finibus facilisis dapibus etiam interdum tortor ligula congue sollicitudin erat viverra ac tincidunt nam porta elementum a enim euismod quam justo lectus commodo augue arcu dignissim velit aliquam imperdiet mollis nullam volutpat porttitor ullamcorper rutrum gravida cras eleifend turpis fames primis vulputate ornare sagittis vehicula praesent dui felis venenatis ultrices proin libero feugiat tristique accumsan maecenas potenti ultricies habitant morbi senectus netus suscipit auctor curabitur facilisi cubilia curae hac habitasse platea dictumst lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit semper vel class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos orci varius natoque penatibus et magnis dis parturient montes nascetur ridiculus mus donec rhoncus eros lobortis nulla molestie mattis scelerisque maximus eget fermentum odio phasellus non purus est efficitur laoreet mauris pharetra vestibulum fusce dictum risus blandit quis suspendisse aliquet nisi sodales consequat magna ante condimentum neque at luctus nibh finibus facilisis dapibus etiam interdum tortor ligula congue sollicitudin erat viverra ac tincidunt nam porta elementum a enim euismod quam justo lectus commodo augue arcu dignissim velit aliquam imperdiet mollis nullam volutpat porttitor ullamcorper rutrum gravida cras eleifend turpis fames primis vulputate ornare sagittis vehicula praesent dui felis venenatis ultrices proin libero feugiat tristique accumsan maecenas potenti ultricies habitant morbi senectus netus suscipit auctor curabitur facilisi cubilia curae hac habitasse platea dictumst lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit semper vel class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos orci varius natoque penatibus et magnis dis parturient montes nascetur ridiculus mus donec rhoncus eros lobortis nulla molestie mattis scelerisque maximus eget fermentum odio phasellus non purus est efficitur laoreet mauris pharetra vestibulum fusce dictum risus blandit quis suspendisse aliquet nisi sodales consequat magna ante condimentum neque at luctus nibh finibus facilisis dapibus etiam interdum tortor ligula congue sollicitudin erat viverra ac tincidunt nam porta elementum a enim euismod quam justo lectus commodo augue arcu dignissim velit aliquam imperdiet mollis nullam volutpat porttitor ullamcorper rutrum gravida cras eleifend turpis fames primis vulputate ornare sagittis vehicula praesent dui felis venenatis ultrices proin libero feugiat tristique accumsan maecenas potenti ultricies habitant morbi senectus netus suscipit auctor curabitur facilisi cubilia curae hac habitasse platea dictumst lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit semper vel class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos orci varius natoque penatibus et magnis dis parturient montes nascetur ridiculus mus donec rhoncus eros lobortis nulla molestie mattis scelerisque maximus eget fermentum odio phasellus non purus est efficitur laoreet mauris pharetra vestibulum fusce dictum risus blandit quis suspendisse aliquet nisi sodales consequat magna ante condimentum neque at luctus nibh finibus facilisis dapibus etiam interdum tortor ligula congue sollicitudin erat viverra ac tincidunt nam porta elementum a enim euismod quam justo lectus commodo augue arcu dignissim velit aliquam imperdiet mollis nullam volutpat porttitor ullamcorper rutrum gravida cras eleifend turpis fames primis vulputate ornare sagittis vehicula praesent dui felis venenatis ultrices proin libero feugiat tristique accumsan maecenas potenti ultricies habitant morbi senectus netus suscipit auctor curabitur facilisi cubilia curae hac habitasse platea dictumst lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit semper vel class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos orci varius natoque penatibus et magnis dis parturient montes nascetur ridiculus mus donec rhoncus eros lobortis nulla molestie mattis scelerisque maximus eget fermentum odio phasellus non purus est efficitur laoreet mauris pharetra vestibulum fusce dictum risus blandit quis suspendisse aliquet nisi sodales consequat magna ante condimentum neque at luctus nibh finibus facilisis dapibus etiam interdum tortor ligula congue sollicitudin erat viverra ac tincidunt nam porta elementum a enim euismod quam justo lectus commodo augue arcu dignissim velit aliquam imperdiet mollis nullam volutpat porttitor ullamcorper rutrum gravida cras eleifend turpis fames primis vulputate.",
              created_at: new Date(),
              author_team: "default",
              permissions: {is_public:1, authenticated:2, team:2},
              like_count: 0,
              comment_count: 0,
          },
          {
              id: 9,
              title: "asdasdaasedada",
              author: "breyner",
              content: "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempo...",
              created_at: new Date(),
              author_team: "default",
              permissions: {is_public:1, authenticated:2, team:2},
              like_count: 1,
              comment_count: 0,
          },
    ]
    const mockLikes: likes[] = [
      { id: 1, user: 1,username: 'usuario1', post: 1 },
      { id: 2, user: 1,username: 'usuario2', post: 1 },
      { id: 3, user: 1,username: 'usuario3', post: 2 }
    ];

    beforeEach(async () => {
      getmockPost = jasmine.createSpyObj('GetPost', ['load', "loadPost"]);
      getmockLikes = jasmine.createSpyObj('GetLikes', ['loadAll', 'likesPerUser']);
      mockLoginService = jasmine.createSpyObj('LoginService', ['logout']);
      mockLocation = jasmine.createSpyObj('Location', ['go']);
      mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

      mockActivatedRoute = {
      paramMap: of({
        get: jasmine.createSpy('get').and.returnValue(null)
      })
      };

      getmockPost.load.and.returnValue(of({
      current: 1,
      total: 1,
      total_count: 2,
      next: null,
      previous: null,
      result: mockPost
    }));
    getmockLikes.likesPerUser.and.returnValue(of({
      current: 1,
      total: 1,
      total_count: 2,
      next: null,
      previous: null,
      result: []
    }));
      await TestBed.configureTestingModule({
        imports: [Home, CommonModule, HttpClientTestingModule],
        providers: [
          {
            provide: GetPost, useValue: getmockPost
          },
          {
            provide: GetLikes, useValue: getmockLikes
          },
          { provide: LoginService, useValue: mockLoginService },
        { provide: Location, useValue: mockLocation },
        { provide: MatSnackBar, useValue: mockSnackBar },
          { provide: ActivatedRoute, useValue: mockActivatedRoute }
        ]
      })
      .compileComponents();

      fixture = TestBed.createComponent(Home);
      component = fixture.componentInstance;
      component.snackbar = mockSnackBar;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });


    it('should show snackbar when loadPost fails', fakeAsync(() => {
      getmockPost.load.and.returnValue(throwError(() => new Error('Network error')));
      component.loadPost(1);
      tick()
      expect(mockSnackBar.open).toHaveBeenCalled();
    }));

    it('should show snackbar when postsLiked fails', () => {
      component.posts = mockPost;
      getmockLikes.likesPerUser.and.returnValue(throwError(() => new Error('Likes error')));

      component.postsLiked();

      expect(mockSnackBar.open).toHaveBeenCalled();
    });


    it('should clean localStorage when logout is called', () => {
      spyOn(localStorage, 'clear');
      mockLoginService.logout.and.returnValue(of({}))
      component.logout();
      expect(localStorage.clear).toHaveBeenCalled();


      expect(component.logged()).toBeFalse();
    });


    it('should handle logout error', fakeAsync(() => {
      mockLoginService.logout.and.returnValue(throwError(() => new Error('Logout error')));

      component.logout();
      tick();

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'could not logout, server error.',
        'close',
        jasmine.objectContaining({
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar-error']
        })
      );
      tick(3000);
      expect(component.disable).toBeFalse();
    }));


    it('should load posts correctly', () => {
      component.loadPost(1);
      expect(getmockPost.load).toHaveBeenCalled();
      expect(component.posts).toEqual(mockPost);
    });

    it('should initialize posts with liked set to false', () => {
      component.loadPost(1);
      component.postsLiked();
      fixture.detectChanges();
      const posts = component.posts;
      expect(posts.length).toBe(mockPost.length);
      posts.forEach(p => {
        if(component.mapa[p.id]){
          expect(component.mapa[p.id]?.bool).toBeFalse();
          expect(component.mapa[p.id]?.id).toBeUndefined();
        }
      });
    });

    it('should open modal when showPostDetail is called', () => {
      const post = mockPost[0];
      component.showPostDetail(post);
      expect(component.modal).toEqual(post);
    });

    it('should close modal when closeModal is called', () => {
      component.modal = mockPost[0];
      component.closeModal();
      expect(component.modal).toBeNull();
    });

    it('should correctly map liked posts in mapa', () => {
      getmockLikes.likesPerUser.and.returnValue(of({
        current: 1, total: 1, total_count: 2, next: null, previous: null,
        result: [{ id: 99, post: 10, user: 1, username: 'test' }]
      }));

      component.posts = mockPost;
      component.postsLiked();
      fixture.detectChanges();

      const updated = component.mapa[10];
      expect(updated.bool).toBeTrue();
      expect(updated.id).toBe(99);
    });

    it('should set finished to true after postsLiked resolves', () => {
      getmockLikes.likesPerUser.and.returnValue(of({
        current: 1, total: 1, total_count: 2, next: null, previous: null, result: []
      }));

      component.posts = mockPost;
      component.postsLiked();
      expect(component.finished).toBeTrue();
    });


    describe('Logout Success', () => {
    beforeEach(() => {
      spyOn(localStorage, 'clear');
      spyOn(localStorage, 'getItem').and.returnValue('mock-token');
    });

    it('should handle successful logout', () => {
      mockLoginService.logout.and.returnValue(of({}));
      component.logged.set(true);

      component.logout();

      expect(component.disable).toBeTrue();
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'logout succesfully.',
        'close',
        jasmine.objectContaining({
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar']
        })
      );
      expect(component.logouted).toBeTrue();
      expect(localStorage.clear).toHaveBeenCalled();
      expect(component.logged()).toBeFalse();
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      component.currentPage = 2;
      component.totalPages = 5;
    });

    it('should go to next page when nextPage is called and not on last page', () => {
      spyOn(component, 'loadPost');

      component.nextPage();

      expect(component.loadPost).toHaveBeenCalledWith(3);
    });

    it('should not go to next page when already on last page', () => {
      component.currentPage = 5;
      spyOn(component, 'loadPost');

      component.nextPage();

      expect(component.loadPost).not.toHaveBeenCalled();
    });

    it('should go to previous page when prevPage is called and not on first page', () => {
      spyOn(component, 'loadPost');

      component.prevPage();

      expect(component.loadPost).toHaveBeenCalledWith(1);
    });

    it('should not go to previous page when already on first page', () => {
      component.currentPage = 1;
      spyOn(component, 'loadPost');

      component.prevPage();

      expect(component.loadPost).not.toHaveBeenCalled();
    });
  });

  describe('Index Calculations', () => {
    beforeEach(() => {
      component.currentPage = 2;
      component.pageSize = 10;
      component.totalPost = 25;
    });

    it('should calculate startIndex correctly', () => {
      const startIndex = component.startIndex();
      expect(startIndex).toBe(10);
    });

    it('should calculate endIndex correctly when not on last page', () => {
      const endIndex = component.endIndex();
      expect(endIndex).toBe(20);
    });

    it('should calculate endIndex correctly when on last page', () => {
      component.currentPage = 3;
      const endIndex = component.endIndex();
      expect(endIndex).toBe(25);
    });
  });

  describe('Modal Management', () => {
    it('should update location when showPostDetail is called with post', () => {
      const post = mockPost[0];

      component.showPostDetail(post);

      expect(component.modal).toBe(post);
      expect(mockLocation.go).toHaveBeenCalledWith(`/home/${post.id}`);
    });

    it('should not update location when showPostDetail is called with null', () => {
      component.showPostDetail(null);

      expect(component.modal).toBeNull();
      expect(mockLocation.go).not.toHaveBeenCalled();
    });

    it('should load posts when closeModal is called and no posts exist', () => {
      component.posts = [];
      spyOn(component, 'loadPost');

      component.closeModal();

      expect(component.loadPost).toHaveBeenCalledWith(1);
      expect(mockLocation.go).toHaveBeenCalledWith("/home");
    });

    it('should not load posts when closeModal is called and posts exist', () => {
      component.posts = mockPost;
      spyOn(component, 'loadPost');

      component.closeModal();

      expect(component.loadPost).not.toHaveBeenCalled();
      expect(mockLocation.go).toHaveBeenCalledWith("/home");
    });
  });

  describe('Post Creation', () => {
    it('should set creating to true when sendPost is called without parameter', () => {
      component.sendPost();
      expect(component.creating).toBe(true);
    });

    it('should set creating to post when sendPost is called with post parameter', () => {
      const post = mockPost[0];
      component.sendPost(post);
      expect(component.creating).toBe(post);
    });

    it('should set creating to false when closeSendPost is called', () => {
      component.creating = true;
      component.closeSendPost();
      expect(component.creating).toBe(false);
    });
  });

  it('should load specific post when id parameter is provided', () => {
      const testPost = mockPost[0];
      mockActivatedRoute.paramMap = of({
        get: jasmine.createSpy('get').and.returnValue('10')
      });
      getmockPost.loadPost.and.returnValue(of(testPost));
      spyOn(component, 'showPostDetail');

      component.ngOnInit();

      expect(getmockPost.loadPost).toHaveBeenCalledWith('10');
      expect(component.showPostDetail).toHaveBeenCalledWith(testPost);
    });

  it('should load posts page 1 when no id parameter is provided', () => {

      spyOn(component, 'loadPost');

      component.ngOnInit();

      expect(component.loadPost).toHaveBeenCalledWith(1);
    });

  });




