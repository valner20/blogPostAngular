import { Component, inject, signal } from '@angular/core';
import { postModel } from '../../../modelos/postModel';
import { GetPost } from '../../../services/getPost/get-post';
import { CommonModule } from '@angular/common';
import { GetLikes } from '../../../services/likes/get-likes';
import {  ActivatedRoute, Router } from '@angular/router';
import { PostDetail } from '../../components/post-detail/post-detail';
import { Post } from '../../components/post/post';
import { Navbar } from '../../components/navbar/navbar';
import { switchMap, of, tap } from 'rxjs';
import { Location } from '@angular/common';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Create } from '../../components/create/create';
import { LoginService } from '../../../services/login-logout/login-logout';
import { RegisterService } from '../../../services/register/register';
@Component({
  selector: 'app-home',
  imports: [Create, CommonModule, PostDetail, Post, Navbar, MatSnackBarModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  router = inject(Router)
  snackbar = inject(MatSnackBar)
  route = inject(ActivatedRoute)
  finished = false
  mapa: {[key:number] : {id:number, bool: boolean}} = {}
  service = inject(GetPost);
  posts!: postModel[];
  modal: postModel | null = null;
  logged = signal<boolean>(!!localStorage.getItem("access"));
  username = localStorage.getItem("username");
  location = inject(Location)
  likeService = inject(GetLikes);
  currentPage: number = 1;
  totalPost: number = 0;
  totalPages: number = 0;
  pageSize = 10
  id= localStorage.getItem("id")
  creating: postModel| boolean = false
  logoutService = inject(LoginService)
  show = false
  logouted = false
  reload = inject(RegisterService)
  constructor(){
    if(this.id)
    this.reload.id(this.id).subscribe({
      next: (res) => {
        localStorage.setItem("username", res.username);
        localStorage.setItem("team",res.teams!)
        localStorage.setItem("staff",res.staff!)
      }
      })
  }

  loadPost(page: number) {
    this.service.load(page).subscribe({
      next: (data) => {

      this.currentPage = data.current
      this.totalPost  = data.total_count
      this.totalPages = data.total
      this.posts = data.result;
      if(!this.logged()){
        this.finished= true
      }
      else{
        this.postsLiked();
      }
    },
    error: () => {
       this.snackbar.open('No se pudieron cargar los post.', 'Cerrar', {
          duration: 3000,
          verticalPosition: "top",
            panelClass: ['custom-snackbar-error']
        });
    }
    });
  }
  postsLiked() {
    let arrayIds: number[] = []
    for (let i = 0; i < this.posts.length; i++) {
        arrayIds[i] = this.posts[i].id
  }
  this.likeService.likesPerUser(arrayIds).subscribe({
    next: (data) => {

      for (let index = 0; index < data.result.length; index++) {
        this.mapa[data.result[index].post] = {id: data.result[index].id, bool:true}
      }
      this.finished = true

    },
    error: () => {
        this.snackbar.open("no se pudieron cargar los likes", "cerrar", {duration: 3000, verticalPosition: "top",panelClass: ['custom-snackbar-error']})
      }
    })
}


  ngOnInit(){
    this.route.paramMap.pipe(
      switchMap((parametro) => {
        let id = parametro.get("id")
        if(id){
          return this.service.loadPost(id)
        }
        else{
          this.loadPost(1)
          return of()
        }
      }

    )
    )
    .subscribe({
      next: data => {
    if (data) this.showPostDetail(data);

     },
    error:(err)=> {
       if (err.status >= 500 && err.status < 600 || err.status === 0) {
     // Es un error del servidor
      this.snackbar.open('Netword error, try again later.', 'Cerrar', {
      duration: 3000,
      panelClass: ['custom-snackbar-error']

    });
    setTimeout(() => {
      this.router.navigate(["/home"])
    }, 3000)

  }
    else{
      this.router.navigate(["/**"])
    }
    }

  })
  }


showPostDetail(post: postModel | null) {
  this.modal = post;
  if(this.modal)
    this.location.go(`/home/${this.modal.id}`);
}

closeModal() {
  this.modal = null;
  if(!this.posts ||this.posts.length <=0){
    this.loadPost(1)
  }
  this.location.go("/home");

}

disable = false

logout() {
  this.disable=true
  this.logoutService.logout()?.subscribe({
    next: ()=>{
       this.snackbar.open('logout succesfully.', 'close', {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar']
        });
        this.logouted = true

      localStorage.clear();
      this.logged.set(false);


    },
    error: () => {
      this.snackbar.open('could not logout, server error.', 'close', {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar-error']
        });
        setTimeout(()=>{
          this.disable = false

        },3000)
    }
  })
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.loadPost(this.currentPage + 1);
  }
}

prevPage() {
  if (this.currentPage > 1) {
    this.loadPost(this.currentPage - 1);
  }
}

startIndex(): number {
  return (this.currentPage - 1) * this.pageSize;
}

endIndex(): number {
  return Math.min(this.startIndex() + this.pageSize, this.totalPost);
}

sendPost(post?:postModel){
  if(post){
    this.creating = post;
  }
  else{
    this.creating = true;

  }
}

closeSendPost(){
  this.creating=false
}



}
