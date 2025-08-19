import { postModel } from './../../../modelos/postModel';
import { Component, Input, Output, EventEmitter, HostListener, inject,ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { likes } from '../../../modelos/likes';
import { GetLikes } from '../../../services/likes/get-likes';
import { GetPost } from '../../../services/getPost/get-post';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Create } from '../create/create';
import truncate from 'truncate-html';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


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
  role = localStorage.getItem("role")
  submiting=false



  giveLike() {
    if (this.liked.bool) {
      this.submiting = true
      this.likeService.delete(this.liked.id).subscribe(() => {
        this.liked = {id: 0, bool: false};
        this.post.like_count--;
        this.submiting=false
      });
    } else {
      this.submiting=true
      this.likeService.post(this.post.id).subscribe({
      next: (res) => {
            if (res) {
              this.liked = { id: res.id, bool: true};
            }
            this.submiting=false

          },
          error: ()=> {
               this.snackbar.open('like could not be gived, server error.', 'close', {
               duration: 3000,
               verticalPosition: "top",
               panelClass: ['custom-snackbar-error']
        });
            this.submiting=false
          }
        });
        this.post.like_count++;
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
    this.likeService.loadLikesPag(this.post.id, page).subscribe({
    next: (res) => {
      this.userLikes = res.result;
      this.currentPage = res.current;
      this.totalLikes = res.total_count;
      this.totalPages = res.total;
      this.overlay = true

    },
    error: () => {
      this.snackbar.open('likes could not be loaded.', 'close', {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar-error']
        });
    }
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
      this.show = false;


  }
  confirm(id: number) {
    this.submiting=true
    this.service.delete(id).subscribe({
      next: () => {
        this.show = false
        this.snackbar.open('Post Deleted.', 'close', {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar']
        });

        setTimeout(() => {
        this.submiting=false
          this.reloadPage()
      }, 3000);
      },
      error: () => {
        this.snackbar.open('Post could not be deleted.', 'close', {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar-error']
        });
        this.submiting=false

      }
    })
  }


  canWrite(permission: {is_public: number, authenticated: number, team:number} ){
    if(!this.logged) return false
    if(this.role=== "admin")return true
    if(this.staff === "true") return true
    if(permission.authenticated==2){
      return true
    }
    if(permission.team == 2 && this.team === this.post.author_team || this.username === this.post.author){
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



  sanitizer = inject(DomSanitizer)

getExcerptHtml(html: string, limit: number = 200): SafeHtml {
  const div = document.createElement('div');
  div.innerHTML = html;
  const fullText = div.textContent || '';

  if (fullText.length <= limit) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  let truncated = '';
  let length = 0;

  function traverse(node: Node) {
    if (length >= limit) return;

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (length + text.length > limit) {
        truncated += text.slice(0, limit - length) + '...';
        truncated += ` <button class="showMore" style="display:inline;">Show More</button>`;
        length = limit;
      } else {
        truncated += text;
        length += text.length;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();

      const attrs = Array.from(el.attributes)
        .map(attr => `${attr.name}="${attr.value}"`)
        .join(' ');

      truncated += `<${tag}${attrs ? ' ' + attrs : ''}>`;
      node.childNodes.forEach(traverse);
      truncated += `</${tag}>`;
    }
  }

  div.childNodes.forEach(traverse);

  return this.sanitizer.bypassSecurityTrustHtml(truncated);
}

  handleExcerptClick(event: MouseEvent) {
  const target = event.target as HTMLElement;

  if (target.classList.contains('showMore')) {
    this.showDetail.emit(this.post);
  }
}

}
