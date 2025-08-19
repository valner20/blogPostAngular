import { loginInterface } from '../../modelos/login';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { auth } from '../../modelos/auth';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  http = inject(HttpClient);
  login(data: loginInterface){
    return this.http.post<auth>("http://127.0.0.1:8000/api/token/", data).pipe(
      tap(res => {
        localStorage.setItem("access",res.access);
        localStorage.setItem("refresh", res.refresh);
        localStorage.setItem("username", res.username);
        localStorage.setItem("team",res.team)
        localStorage.setItem("staff",res.staff )
      })
    )
  }


  logout(){
    let refresh = localStorage.getItem("refresh")
    if(refresh)
      return this.http.post("http://127.0.0.1:8000/logout/",{refresh} )
    return
  }
}
