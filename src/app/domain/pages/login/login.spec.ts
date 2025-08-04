  import { HttpClientTestingModule } from '@angular/common/http/testing';
  import { ComponentFixture, TestBed } from '@angular/core/testing';
  import { of, throwError } from 'rxjs';
  import { ReactiveFormsModule } from '@angular/forms';
  import { Login } from './login';
  import { LoginService } from '../../../services/login/login';
  import { Router } from '@angular/router';
  import { provideHttpClientTesting } from '@angular/common/http/testing';
  import { provideRouter } from '@angular/router';
  import { provideAnimations } from '@angular/platform-browser/animations';
  describe('Login', () => {
    let component: Login;
    let fixture: ComponentFixture<Login>;
    let service: jasmine.SpyObj<LoginService>
    let router: jasmine.SpyObj<Router>

    beforeEach(async () => {
      service = jasmine.createSpyObj("LoginService", ["login"]);
      await TestBed.configureTestingModule({
        imports: [Login, ReactiveFormsModule, HttpClientTestingModule],
          providers:
          [
            {
            provide: LoginService, useValue: service
            },

            provideRouter([])

                  ]
      })
      .compileComponents();
      router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
      spyOn(router, 'navigate');

      fixture = TestBed.createComponent(Login);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it("should be wrong if the form is empty", () => {
      expect(component.form.valid).toBeFalse()
    })

    it("should call the service function and go to home", () => {
      component.form.setValue({
        email: "avanzatechsito@gmail.com",
        password: "1234"
      })
      service.login.and.returnValue(of({
        access:"as",
        refresh:"aaa",
        username:"ada",
        team:"ad",
        staff:""
      }))
      component.login();
      expect(service.login).toHaveBeenCalledWith({ email: "avanzatechsito@gmail.com", password: "1234" });
      expect(router.navigate).toHaveBeenCalledWith(["/home"]);


    })

    it("should be 401 if there is a mistake on the fields", () => {
      component.form.setValue({
        email: "avanzatechsito@gmail.com",
        password: "1234"
      })
      service.login.and.returnValue(throwError(() =>({status: 401})));
      component.login();
      expect(component.cantlog).toBeTrue()
      expect(component.error).toBeTrue()
      expect(component.serverStuck).toBeFalse()
    })

    it("should show a mistake if the server is out of work", () =>{
      component.form.setValue({
        email: "avanzatechsito@gmail.com",
        password: "1234"
      })
      //it must work for any other status code like 500 because i use the same error type for all errors, just an unexpected error
      service.login.and.returnValue(throwError(() =>({status: 0})));
      component.login();
      expect(component.cantlog).toBeFalse()
      expect(component.error).toBeTrue()
      expect(component.serverStuck).toBeTrue()
      } )

      it("should clean the errors when you are typing", () => {
        component.error = true;
        component.cantlog = true;
        component.serverStuck = true;
        const typing = component.form.get("email")
        typing?.setValue("alo@gmail")
        typing?.markAsDirty()
        typing?.updateValueAndValidity()
        expect(component.error).toBeFalse()
        expect( component.cantlog).toBeFalse()
        expect(component.serverStuck).toBeFalse()

      })

    it("should chance between password and text", () => {
      const passwordInput: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="password"]');
      const toggleButton = fixture.nativeElement.querySelector('button');

      expect(passwordInput.type).toBe('password');

      toggleButton.click();
      fixture.detectChanges();

      expect(passwordInput.type).toBe('text');

      toggleButton.click();
      fixture.detectChanges();

      expect(passwordInput.type).toBe('password');
        })


  });
