import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { pagination } from '../../modelos/pagination';
import { likes } from '../../modelos/likes';
import { jwtDecode } from 'jwt-decode';
import { of } from 'rxjs';
export interface jwt {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class GetLikes {
  service = inject(HttpClient);
  private url ="http://127.0.0.1:8000/likes/"

  loadLikesPag(idPost:number, pag?: number){
    if(pag){
    return this.service.get<pagination<likes>>(this.url, {
      params: {
        post: idPost,
        page: pag
      }
    })

    }
    return this.service.get<pagination<likes>>(`${this.url}?post=${idPost}`)
  }

  loadAll(){
    return this.service.get<pagination<likes>>(this.url);
  }

    post(id:number){
    return this.service.post<likes>(this.url, {post: id});
    }
    delete(id:number){
    return this.service.delete(`${this.url}${id}/`)

    }

  likesPerUser(idPost: number | number[]){
    const token = localStorage.getItem("access");
  if (token) {
    const decode = jwtDecode<jwt>(token);
    if (decode) {
      const postParam = Array.isArray(idPost) ? idPost.join(",") : idPost.toString();

      return this.service.get<pagination<likes>>(this.url, {
        params: {
          user: decode.user_id,
          post: postParam
        }
      });
    }
  }
  return of()
  }

}
