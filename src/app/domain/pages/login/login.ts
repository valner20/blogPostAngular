import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../../services/login-logout/login-logout';
import { loginInterface } from '../../../modelos/login';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule, MatIconModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone:true
})
export class Login {
  service =  inject(LoginService);
  router = inject(Router);
  info = inject(FormBuilder);
  error = false
  cantlog = false;
  serverStuck = false;
  form = this.info.group({
    email: ["",[Validators.required, Validators.email]],
    password:["",[Validators.required]]

  })
  ngOnInit(){
    this.clearError("email");
    this.clearError("password");
  }
  verContrasena=false;
    login(){
      if (this.form.invalid) return;
      this.service.login(this.form.value as loginInterface).subscribe({
        next: () => {

          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.error = true
          if(error.status === 401){
            this.cantlog = true;
            this.serverStuck =false
          }
          else {

            this.serverStuck = true;
          }
        }
      })

  }

  contrasena(){
    this.verContrasena = !this.verContrasena
  }

  private clearError(field: string) {
  this.form.get(field)?.valueChanges.subscribe(() => {
    if (this.error) {
      this.error = false;
      this.serverStuck =false
      this.cantlog = false
    }
    this.form.get(field)?.markAsUntouched();
  });
}
}
