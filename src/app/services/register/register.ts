import { register } from './../../modelos/registro';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  http = inject(HttpClient)
  private url = "http://127.0.0.1:8000/register/"
  register(data: register ){
    return this.http.post<register>(this.url,data)
  }
}
