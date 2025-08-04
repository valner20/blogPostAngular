import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterService } from '../../../services/register/register';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Register } from './register';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';


describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let service: RegisterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        provideRouter([])
  ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    service = TestBed.inject(RegisterService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("should be unable when the fields are empty", () => {
    expect(component.form.invalid).toBeTrue()
  });
  it("should pass if the info is completed", ()=> {
    component.form.setValue({
      username: "user",
      email:"user@gmail.com",
      password:"1234",
      confirm: "1234"
    })
    expect(component.form.valid).toBeTrue()
  });
  it("should fail for username empty", ()=>{
    component.form.setValue({
      username: null,
      email:"user@gmail.com",
      password:"1234",
      confirm: "1234"
    })
    expect(component.form.valid).toBeFalse()
    expect(component.form.get("username")?.hasError("required")).toBeTrue()
  });
  it("should fail for email empty", ()=>{
    component.form.setValue({
      username: "null",
      email:null,
      password:"1234",
      confirm: "1234"
    })
    expect(component.form.valid).toBeFalse()
    expect(component.form.get("email")?.hasError("required")).toBeTrue()

  });it("should fail for passwprd empty", ()=>{
    component.form.setValue({
      username: "null",
      email:"user@gmail.com",
      password: null,
      confirm: "1234"
    })
    expect(component.form.valid).toBeFalse()
    expect(component.form.get("password")?.hasError("required")).toBeTrue()

  });it("should fail for confirmPassword empty", ()=>{
    component.form.setValue({
      username: "null",
      email:"user@gmail.com",
      password:"1234",
      confirm: null
    })
    expect(component.form.valid).toBeFalse()
    expect(component.form.get("confirm")?.hasError("required")).toBeTrue()
  });

  it("should fail if the password and confirm are differents", ()=>{
    component.form.setValue({
      username: "null",
      email:"user@gmail.com",
      password: "123",
      confirm: "1234"
    })
    expect(component.form.errors).toEqual({error:true});
  })

  it("should work and once its sent the form must be empty", () =>{
    component.form.setValue({
      username: "null",
      email:"user@gmail.com",
      password: "1234",
      confirm: "1234"
    })
    const spy = spyOn(service, "register").and.returnValue(of({
       username: "null",
      email:"user@gmail.com",
      password: "1234",
    }));
    component.create()
    expect(spy).toHaveBeenCalled();
    expect(component.form.value).toEqual({
      username: null,
      email:null,
      password:null ,
      confirm: null
    })
  })

  it("should handle backend errors for username existent", () => {
    const spy = spyOn(service, "register").and.returnValue(throwError(()=> ({
      error:{

        username: ["username Exist"]
      }
    })));
    component.form.setValue({
      username: "null",
      email:"user@gmail.com",
      password: "1234",
      confirm: "1234"
    })
    component.create()
    expect(component.form.get("username")?.errors).toEqual({
      usernameError: ["username Exist"]
    })
    expect(component.form.get("email")?.errors).toBeNull()

  })

  it("should handle backend errors for email existent", () => {
    const spy = spyOn(service, "register").and.returnValue(throwError(()=>({
      error:{
        email: ["email Exist"]
      }
    })));
    component.form.setValue({
      username: "null",
      email:"user@gmail.com",
      password: "1234",
      confirm: "1234"
    })
    component.create()
    expect(component.form.get("email")?.errors).toEqual({
      emailError: ["email Exist"]

    })
    expect(component.form.get("username")?.errors).toBeNull();

  })

  it("should handle backend errors for email and username existent", () => {
    const serviceError= {
      error: {
        username: ["username Exist"],
        email: ["email Exist"]
      }

    }
    const spy = spyOn(service, "register").and.returnValue(throwError(()=>{
     return serviceError
    }));
    component.form.setValue({
      username: "null",
      email:"user@gmail.com",
      password: "1234",
      confirm: "1234"
    })
    component.create()
    expect(component.form.get("email")?.errors).toEqual({
      emailError: ["email Exist"]

    })
    expect(component.form.get("username")?.errors).toEqual({
      usernameError: ["username Exist"]
    })

  })

  it("should delete errors after start typing" ,() => {
    const control = component.form.get("username");
    control?.setErrors({ usernameError: ["username Exist"] });
    expect(control?.errors).toEqual({ usernameError: ["username Exist"] });
    control?.setValue("nuevoUsuario");
    expect(control?.errors).toBeNull();

  })




});
