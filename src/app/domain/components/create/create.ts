import { Component, Output, EventEmitter, inject,signal, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GetPost } from '../../../services/getPost/get-post';
import { postCreation } from '../../../modelos/postCreation';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { postModel } from '../../../modelos/postModel';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-create',
  imports: [ReactiveFormsModule, MatSnackBarModule, QuillModule],
  templateUrl: './create.html',
  styleUrl: './create.css'
})
export class Create {
  constructor(private snackbar: MatSnackBar){
  }
  @Input() editing: boolean = false
  @Input() post?: postModel
  service = inject(GetPost)
  builder = inject(FormBuilder);
  permissionOptions = [
    { label: "none", value: 0 },
    { label: "read_only", value: 1 },
    { label: "read_and_write", value: 2 }
  ];

  isPublicOptions = [
    { label: 'none', value: 0 },
    { label: 'read_only', value: 1 }
  ];
  is_public = signal(this.isPublicOptions)
  auth = signal(this.permissionOptions)
  teamOptions = signal(this.permissionOptions);

  form!: FormGroup
  @Output() close = new EventEmitter<void>()

ngOnInit() {
 this.form = this.builder.group({
    title: [this.post?.title ?? "", [Validators.required]],
    content: [this.post?.content ?? "", [Validators.required]],
    is_public: [this.post?.permissions?.is_public ?? 1, [Validators.required]],
    authenticated: [this.post?.permissions?.authenticated ?? 2, [Validators.required]],
    team: [this.post?.permissions?.team ?? 2, [Validators.required]],
  });

  this.setValues();
}


setValues(){
  let controlpublic = this.form.controls['is_public'];
  let controlAuth = this.form.controls['authenticated'];
  let controlTeam = this.form.controls['team'];

  this.form.get("is_public")?.valueChanges.subscribe(is_public => {
    if(is_public === null)return
    let auth = controlAuth.value ?? 0
    if(is_public > auth){
      console.log("Changing auth from public")
      controlAuth.setValue(is_public)
    }
    this.auth.set(this.permissionOptions.filter(p => p.value >= is_public))

  })



  this.form.get("authenticated")?.valueChanges.subscribe(auth => {
    if(auth === null)return
    let team = controlTeam.value?? 0;
    if(auth > team ){
      console.log("Changing team from auth")
      controlTeam.setValue(auth)
    }
    if(controlpublic.value && controlpublic.value > auth){
      controlpublic.setValue(auth)
    }
    this.teamOptions.set(this.permissionOptions.filter(p => p.value >= auth))
    this.is_public.set(this.isPublicOptions.filter(p => p.value <= auth))

  })

   //si el team cambia primero cambia el auth y cambio public como cadena
  this.form.get("team")?.valueChanges.subscribe(team =>{
    if(team === null)return
    let auth = controlAuth.value ?? 0;
    if(team < auth){
      console.log("Changing auth from team")
      controlAuth.setValue(team)
    }
    this.auth.set(this.permissionOptions.filter(p => p.value <= team))
  })

}

  onClose(){
    this.close.emit()
  }

  submit(){
    if(this.form.valid){
        const data = this.form.getRawValue() as postCreation;
        data.content = data.content.replace(/<p><\/p>/g, '<p>&nbsp;</p>');

        this.service.sendPost(data, this.editing? this.post!.id: undefined).subscribe({
          next: () => {
            this.snackbar.open('Post created.', 'close', {
              duration: 2000,
          verticalPosition: "top"
        });

        setTimeout(() => {
          this.reloadPage()
        }, 2000);

      },
      error: () => {
        this.snackbar.open('Post could not be created.', 'close', {
          duration: 2000,
          verticalPosition: "top"})
        }

      })
    }


  }

  reloadPage(){
    window.location.reload();

  }


  quillConfig = {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],

          [{ 'header': [1, 2, 3, false] }],

          [{ 'list': 'ordered'}, { 'list': 'bullet' }],

          [{ 'indent': '-1'}, { 'indent': '+1' }],

          [{ 'script': 'sub'}, { 'script': 'super' }],
          [{ 'direction': 'rtl' }],

          [{ 'align': [] }],

          [{ 'color': [] }, { 'background': [] }],

          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'font': [] }],

          ['link'],
          ['clean']
        ],

      },
      theme: 'snow',
      placeholder: 'Write your post content here...',
      bounds: '#editor-container',
      modules: {
        clipboard: {
          matchVisual: false
        }
      }
    };





}
