import { postModel } from './../../../modelos/postModel';
import { Component, Input, Output, EventEmitter, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { likes } from '../../../modelos/likes';
import { GetLikes } from '../../../services/likes/get-likes';
import { GetPost } from '../../../services/getPost/get-post';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Create } from '../create/create';

@Component({
  selector: 'app-post',
  imports: [CommonModule, MatSnackBarModule, Create],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class Post {
  snackbar = inject(MatSnackBar)
  @Input() post!: postModel;
  @Input() liked!: {id: number, bool:boolean}
  @Input() logged: boolean = false;
  @Output() showDetail = new EventEmitter<postModel>();
  private likeService = inject(GetLikes);
  private service = inject(GetPost)
  userLikes: likes[] = [];
  currentPage: number = 1;
  totalLikes: number = 0;
  totalPages: number = 0;
  overlay: boolean = false;
  pageSize = 15;
  show = false
  editing = false
  team = localStorage.getItem("team")
  username = localStorage.getItem("username")
  staff = localStorage.getItem("staff")

  giveLike() {
    if (this.liked.bool) {
      this.likeService.delete(this.liked.id).subscribe(() => {
        this.liked = {id: 0, bool: false};
        this.post.like_count--;
      });
    } else {
      this.likeService.post(this.post.id).subscribe((res) => {
        this.likeService.likesPerUser(this.post.id).subscribe({
          next: (res) => {
            if (res.result.length > 0) {
              this.liked = { id: res.result[0].id, bool: true};
            }
          }
        });
        this.post.like_count++;
      });
    }
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const isOverlay = (event.target as HTMLElement).id === 'likes-overlay';
    if (!isOverlay) {
      this.overlay = false;
    }
  }

  showLikes() {
    if (!this.overlay) {
      this.loadLikes();
    }
    else {
      this.overlay = false;
    }
  }

  loadLikes(page: number = 1) {
    this.likeService.loadLikesPag(this.post.id, page).subscribe((res) => {
      this.userLikes = res.result;
      this.currentPage = res.current;
      this.totalLikes = res.total_count;
      this.totalPages = res.total;
      this.overlay = true

    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadLikes(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.loadLikes(this.currentPage - 1);
    }
  }

  startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  endIndex(): number {
    return Math.min(this.startIndex() + this.pageSize, this.totalLikes);
  }

  delete(){
    this.show = true
  }

  close(){
    this.show = false
  }
  confirm(id: number) {
    this.service.delete(id).subscribe({
      next: () => {
        this.show = false
        this.snackbar.open('Post Deleted.', 'close', {
          duration: 2000,
          verticalPosition: "top"
        });

        setTimeout(() => {
          this.reloadPage()
      }, 2000);
      },
      error: () => {
        this.snackbar.open('Post could not be deleted.', 'close', {
          duration: 3000,
          verticalPosition: "top"
        });
      }
    })
  }
  canWrite(permission: {is_public: number, authenticated: number, team:number} ){
    if(permission.authenticated==2){
      return true
    }
    if(permission.team ==2 && this.username === this.post.author){
     return true
    }
    return false
  }

  reloadPage(){
    window.location.reload();

  }

  closeUpdate(){
    this.editing = false
  }


}
