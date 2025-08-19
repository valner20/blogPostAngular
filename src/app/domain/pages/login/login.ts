import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../../services/login-logout/login-logout';
import { loginInterface } from '../../../modelos/login';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule, MatIconModule, RouterModule, MatSnackBarModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone:true
})
export class Login {
  snackbar = inject(MatSnackBar)
  service =  inject(LoginService);
  router = inject(Router);
  info = inject(FormBuilder);
  error = false
  cantlog = false;
  serverStuck = false;
  submiding = false;
  form = this.info.group({
    email: ["",[Validators.required, Validators.email], ],
    password:["",[Validators.required]]

  })
  ngOnInit(){
    this.clearError("email");
    this.ojitosPassword("password");
  }
  verContrasena=false;
    login(){
      if (this.form.invalid) return;
      this.submiding=true
      this.service.login(this.form.value as loginInterface).subscribe({
        next: () => {
          this.submiding=false
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.error = true
          if(error.status === 401){
            this.cantlog = true;
            this.serverStuck =false
          }
          else {
            this.snackbar.open('could not be registered, server error', 'Cerrar', {
              duration: 3000,
              panelClass: ['custom-snackbar-error']
    });
            this.serverStuck = true;
          }
          this.submiding=false
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
ojito = false
private ojitosPassword(field: string) {
  this.form.get(field)?.valueChanges.subscribe(() => {
    let len = this.form.get(field)?.value.length
    if(len && len > 0) this.ojito = true
    else this.ojito = false
    if (this.error) {
      this.error = false;
      this.serverStuck =false
      this.cantlog = false
    }
    this.form.get(field)?.markAsUntouched();
  });
}

}
