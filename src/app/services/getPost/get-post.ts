import { inject, Injectable, numberAttribute } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { pagination } from '../../modelos/pagination';
import { postModel } from '../../modelos/postModel';
import { __param } from 'tslib';
import { postCreation } from '../../modelos/postCreation';
@Injectable({
  providedIn: 'root'
})
export class GetPost {
  service = inject(HttpClient);
  url = "http://127.0.0.1:8000/Post/"
  load(pag?:number){
    if(pag)
      return this.service.get<pagination<postModel>>(this.url,{params: {
        page: pag
        }})
    return this.service.get<pagination<postModel>>(this.url)
  }
  loadPost(id: string){
    return this.service.get<postModel>(this.url+id+"/")
  }

  sendPost(post: postCreation){
    return this.service.post(this.url, post)
  }

  delete(id:number){
    return this.service.delete(this.url+id+"/")
  }

}
