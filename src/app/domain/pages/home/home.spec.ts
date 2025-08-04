  import { ComponentFixture, TestBed } from '@angular/core/testing';
  import { of } from 'rxjs';
  import { Home } from './home';
  import { GetPost } from '../../../services/getPost/get-post';
  import { GetLikes } from '../../../services/likes/get-likes';
  import { CommonModule } from '@angular/common';
  import { postModel } from '../../../modelos/postModel';
  import { likes } from '../../../modelos/likes';
  import { ActivatedRoute } from '@angular/router';
  describe('Home', () => {
    let component: Home;
    let fixture: ComponentFixture<Home>;
    let getmockPost: jasmine.SpyObj<GetPost>
    let getmockLikes: jasmine.SpyObj<GetLikes>
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
      getmockPost = jasmine.createSpyObj('GetPost', ['load']);
      getmockLikes = jasmine.createSpyObj('GetLikes', ['loadAll', 'likesPerUser']);
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
        imports: [Home, CommonModule],
        providers: [
          {
            provide: GetPost, useValue: getmockPost
          },
          {
            provide: GetLikes, useValue: getmockLikes
          },
          {
          provide: ActivatedRoute,
            useValue: {
            snapshot: {
              params: {},
              queryParams: {}
            },
            params: of({}),
            queryParams: of({}),
            paramMap: of({
              get: (key: string) => null
            })
          }
        }
        ]
      })
      .compileComponents();

      fixture = TestBed.createComponent(Home);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should clean localStorage when logout is called', () => {
      spyOn(localStorage, 'clear');
      component.logout();
      expect(localStorage.clear).toHaveBeenCalled();
      expect(component.logged()).toBeFalse();
    });

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
  });
