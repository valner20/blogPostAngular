import { register } from './../../../modelos/registro';
import { Component, inject } from '@angular/core';
import { RegisterService } from '../../../services/register/register';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterModule, MatSnackBarModule],
  templateUrl: './register.html',
  standalone:true,
  styleUrl: './register.css'
})
export class Register {
  snackbar = inject(MatSnackBar)
  router = inject(Router)
  error = false;
  send = inject(FormBuilder);
  service = inject(RegisterService);
  form = this.send.group({
    username: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]],
    confirm: ["", [Validators.required]]

  },
  {validators:[this.passwordValidator("password", "confirm")]}
);

  constructor(){
    this.clearError("email");
    this.clearError("username");

  }

  create(){

    if(this.form.valid){
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
      panelClass: ["custom-style"]

    });
  }
}
