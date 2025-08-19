import { DatePipe } from '@angular/common';
import { postModel } from './../../../modelos/postModel';
import { Component, Input, Output,EventEmitter, inject } from '@angular/core';
import { GetComments } from '../../../services/comments/get-comments';
import { commentsModel } from '../../../modelos/comments';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-post-detail',
  imports: [DatePipe, FormsModule, MatSnackBarModule],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.css'
})
export class PostDetail {
  @Input() post!: postModel;
  @Output() close = new EventEmitter<void>();
  @Input() logged!: boolean
  service = inject(GetComments)
  comments: commentsModel[] = []
  currentPage: number = 1;
  totalComments: number = 0;
  totalPages: number = 0;
  overlay: boolean = false;
  pageSize = 5;
  comment: string = ""
  empty: boolean = false
  snackbar = inject(MatSnackBar)
  submiting =false

  ngOnInit(){
    this.loadComments(1)
  }

  onClose() {
    this.close.emit();
  }


  loadComments(page:number){
    this.service.load(this.post.id, page).subscribe({
      next: (data) => {
        this.currentPage = data.current
        this.totalComments = data.total_count
        this.totalPages = data.total
        this.comments = data.result
        this.submiting=false
      },
      error: () => {
        this.snackbar.open('could not load comments.', 'close', {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar-error']
        });
      this.submiting=false
      }
    })
  }


   nextPage() {
    if (this.currentPage < this.totalPages) {
      this.submiting=true
      this.loadComments(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.submiting=true
      this.loadComments(this.currentPage - 1);
    }
  }

  startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  endIndex(): number {
    return Math.min(this.startIndex() + this.pageSize, this.totalComments);
  }

  send(){
    if(this.comment.length > 0){
      this.submiting=true
      this.service.send(this.post.id, this.comment).subscribe({
        next: ()=>{
          this.comment = ""
          this.snackbar.open('comment created.', 'close', {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ['custom-snackbar']
          });
          this.loadComments(this.currentPage)
          this.post.comment_count++;
        },
        error: () => {
          this.snackbar.open('comment could not be created.', 'close', {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar-error']
        });
        setTimeout(()=>{

          this.submiting=false
        },1500)
        }
       })
    }

  }
  cancel(){
    this.comment=""
  }

  sanitizer = inject(DomSanitizer)
  htmlloron(html: string): SafeHtml {
  const div = document.createElement('div');
  div.innerHTML = html;
  return this.sanitizer.bypassSecurityTrustHtml(div.innerHTML);
}


}
