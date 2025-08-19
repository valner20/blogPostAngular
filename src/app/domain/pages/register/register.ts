import { register } from './../../../modelos/registro';
import { Component, inject } from '@angular/core';
import { RegisterService } from '../../../services/register/register';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {  MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgIf, RouterModule, MatSnackBarModule, MatIconModule],
  templateUrl: './register.html',
  standalone:true,
  styleUrl: './register.css'
})
export class Register {
  snackbar = inject(MatSnackBar)
  router = inject(Router)
  error = false;
  verContrasena= false
  send = inject(FormBuilder);
  service = inject(RegisterService);
  submiting = false
  form = this.send.group({
    username: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email, Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/)]],
    password: ["", [Validators.required]],
    confirm: ["", [Validators.required]]

  },
  {validators:[this.passwordValidator("password", "confirm")]}
);

  constructor(){
    this.clearError("email");
    this.clearError("username");


  }

  ojitoP = false
  ojitoC = false
  ngOnInit(){
    this.ojitoPasswords("password",1);
    this.ojitoPasswords("confirm",2);
  }

  ojitoPasswords(type:string, num: number){
    this.form.get(type)?.valueChanges.subscribe(() => {
    const len = this.form.get(type)?.value?.length;
    if(len && len> 0)
      num ===1? this.ojitoP = true : this.ojitoC = true

    else{
      num ===1? this.ojitoP = false : this.ojitoC = false
    }
    const control = this.form.get(type);
    if (this.error) {
      this.error = false;
      control?.setErrors(null);

    }
    this.form.get(type)?.markAsUntouched();
  });
  }

  create(){

    if(this.form.valid){
      this.submiting=true
      const data:register = {
        username: this.form.get("username")?.value!,
        password : this.form.get("password")?.value!,
        email: this.form.get("email")?.value!
      }
      this.service.register(data).subscribe({
        next:() => {
          this.form.reset()
          this.mensaje()
          setTimeout(() =>{
            this.submiting=false
            this.router.navigate(["/login"])
          }, 3000)
        },
        error: (err) => {
          const error = err.error;
          if(error.email){
            this.form.get("email")?.setErrors({emailError: error.email});

          }
           if(error.username){
            this.form.get("username")?.setErrors({usernameError: error.username});
          }
          if (!error.email && !error.username){
             this.snackbar.open('could not be registered, server error', 'Cerrar', {
              duration: 3000,
              panelClass: ['custom-snackbar-error']
    });
          }
          setTimeout(()=>{
            this.submiting=false
          },1000)
        }
      });

    }
    else{
      this.form.markAllAsTouched();
    }
  }
  passwordValidator(passwordKey:string, confirmKey:string): ValidatorFn{
    return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey)?.value;
    const confirm = group.get(confirmKey)?.value;
    return password === confirm ? null : { error: true };
  };

  }


  private clearError(field: string) {
  this.form.get(field)?.valueChanges.subscribe(() => {
    const control = this.form.get(field);
    if (this.error) {
      this.error = false;
      control?.setErrors(null);

    }
    this.form.get(field)?.markAsUntouched();
  });
}
  mensaje() {
    this.snackbar.open('Registrado con exito', 'Cerrar', {
      duration: 3000,
      panelClass: ['custom-snackbar']
    });
  }
}
