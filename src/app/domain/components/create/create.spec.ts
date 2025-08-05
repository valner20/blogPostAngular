import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Create } from './create';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetPost } from '../../../services/getPost/get-post';
import { of, throwError } from 'rxjs';
import { postCreation } from '../../../modelos/postCreation';

describe('Create', () => {
  let component: Create;
  let fixture: ComponentFixture<Create>;
  let service: GetPost;

 beforeEach(async () => {
  const postSpy = jasmine.createSpyObj("GetPost", ["sendPost"]);
  await TestBed.configureTestingModule({
    imports: [Create, ReactiveFormsModule],
    providers: [
      { provide: GetPost, useValue: postSpy },
    ]
  }).compileComponents();

  fixture = TestBed.createComponent(Create);
  component = fixture.componentInstance;

  service = TestBed.inject(GetPost);
  spyOn(component, 'reloadPage');
  fixture.detectChanges();
});

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should emit close when onClose is called", () => {
    spyOn(component.close, "emit");
    component.onClose();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it("should not send info if form is invalid", () => {
    component.form.patchValue({ title: '', content: '' });
    component.submit();
    expect(service.sendPost).not.toHaveBeenCalled();
  });

  it("should call service and show snackbar on submission valid", fakeAsync(() => {
    const data: postCreation = {
      title: "qaa",
      content: "12345",
      is_public: 1,
      authenticated: 2,
      team: 2
    };
    component.form.setValue(data);
    (service.sendPost as jasmine.Spy).and.returnValue(of({}));

    component.submit();
    tick(2000);

    expect(service.sendPost).toHaveBeenCalledWith(data);

    expect(component.reloadPage).toHaveBeenCalled();
  }));

  it("should show error snackbar if sendPost fails", fakeAsync(() => {
  const data: postCreation = {
    title: "fail",
    content: "error case",
    is_public: 1,
    authenticated: 2,
    team: 2
  };
  component.form.setValue(data);
  (service.sendPost as jasmine.Spy).and.returnValue(throwError(() => new Error('error')));

  component.submit();
  tick();


  expect(component.reloadPage).not.toHaveBeenCalled();
}));

 it('should initialize form with default values', () => {
    expect(component.form.get('title')?.value).toBe('');
    expect(component.form.get('content')?.value).toBe('');
    expect(component.form.get('is_public')?.value).toBe(1);
    expect(component.form.get('authenticated')?.value).toBe(2);
    expect(component.form.get('team')?.value).toBe(2);
  });

  it('should initialize signals with correct values', () => {
    expect(component.is_public()).toEqual(component.isPublicOptions);
    expect(component.auth()).toEqual(component.permissionOptions);
    expect(component.teamOptions()).toEqual(component.permissionOptions);
  });

   it('should call setValues on ngOnInit', () => {
    spyOn(component, 'setValues');
    component.ngOnInit();
    expect(component.setValues).toHaveBeenCalled();
  });

  it("should not send info if form is invalid", () => {
    component.form.patchValue({ title: '', content: '' });
    component.submit();
    expect(service.sendPost).not.toHaveBeenCalled();
  });
describe('Permission Logic Tests', () => {

    it('should update authenticated when is_public is greater', () => {
      component.form.patchValue({
        is_public: 1,
        authenticated: 0
      });

      expect(component.form.get('authenticated')?.value).toBe(1);
    });

    it('should filter auth options when is_public changes', () => {
      component.form.patchValue({ is_public: 1 });

      const expectedOptions = component.permissionOptions.filter(p => p.value >= 1);
      expect(component.auth()).toEqual(expectedOptions);
    });

    it('should not update authenticated when is_public is null', () => {
      const initialAuthValue = component.form.get('authenticated')?.value;
      component.form.patchValue({ is_public: null });

      expect(component.form.get('authenticated')?.value).toBe(initialAuthValue);
    });

    it('should update team when authenticated is greater', () => {
      component.form.patchValue({
        authenticated: 2,
        team: 0
      });

      expect(component.form.get('team')?.value).toBe(2);
    });

    it('should update is_public when authenticated is lower', () => {
      component.form.patchValue({
        is_public: 1,
        authenticated: 0
      });

      expect(component.form.get('is_public')?.value).toBe(0);
    });

    it('should filter team options when authenticated changes', () => {
      component.form.patchValue({ authenticated: 1 });

      const expectedTeamOptions = component.permissionOptions.filter(p => p.value >= 1);
      expect(component.teamOptions()).toEqual(expectedTeamOptions);
    });

    it('should filter is_public options when authenticated changes', () => {
      component.form.patchValue({ authenticated: 1 });

      const expectedPublicOptions = component.isPublicOptions.filter(p => p.value <= 1);
      expect(component.is_public()).toEqual(expectedPublicOptions);
    });

    it('should not update when authenticated is null', () => {
      const initialTeamValue = component.form.get('team')?.value;
      const initialPublicValue = component.form.get('is_public')?.value;

      component.form.patchValue({ authenticated: null });

      expect(component.form.get('team')?.value).toBe(initialTeamValue);
      expect(component.form.get('is_public')?.value).toBe(initialPublicValue);
    });

    it('should update authenticated when team is lower', () => {
      component.form.patchValue({
        authenticated: 2,
        team: 0
      });

      expect(component.form.get('authenticated')?.value).toBe(0);
    });

    it('should filter auth options when team changes', () => {
      component.form.patchValue({ team: 1 });

      const expectedAuthOptions = component.permissionOptions.filter(p => p.value <= 1);
      expect(component.auth()).toEqual(expectedAuthOptions);
    });

    it('should not update when team is null', () => {
      const initialAuthValue = component.form.get('authenticated')?.value;
      component.form.patchValue({ team: null });

      expect(component.form.get('authenticated')?.value).toBe(initialAuthValue);
    });

    it('should handle edge case when team equals auth', () => {
      component.form.patchValue({
        authenticated: 1,
        team: 1
      });

      expect(component.form.get('authenticated')?.value).toBe(1);
    });

    it('should handle complex permission cascade', () => {
      component.form.patchValue({
        is_public: 2,
        authenticated: 0,
        team: 0
      });

      expect(component.form.get('authenticated')?.value).toBe(2);
      expect(component.form.get('team')?.value).toBe(2);
    });
  });

  describe('Form Validation Tests', () => {

    it('should be invalid when title is empty', () => {
      component.form.patchValue({ title: '' });
      expect(component.form.get('title')?.invalid).toBeTruthy();
      expect(component.form.invalid).toBeTruthy();
    });

    it('should be invalid when content is empty', () => {
      component.form.patchValue({ content: '' });
      expect(component.form.get('content')?.invalid).toBeTruthy();
      expect(component.form.invalid).toBeTruthy();
    });

    it('should be valid when all required fields are filled, the choices have default value', () => {
      component.form.patchValue({
        title: 'Test Title',
        content: 'Test Content'
      });
      expect(component.form.valid).toBeTruthy();
    });
  });

});
