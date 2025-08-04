import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { pagination } from '../../modelos/pagination';
import { commentsModel } from '../../modelos/comments';
@Injectable({
  providedIn: 'root'
})
export class GetComments {
  url = "http://127.0.0.1:8000/comment/"
  service = inject(HttpClient)

  load(id: number, page: number){
    return this.service.get<pagination<commentsModel>>(this.url, {params: {
      post: id,
      page: page
    }});
  }

  send(id: number, content:string){
    return this.service.post(this.url,{post:id, content: content})
  }

}
