import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstanceSelect, MaterialService} from '../shared/classes/material.service';
import {User} from '../shared/intefaces';
import {AuthService} from '../shared/services/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params} from '@angular/router';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  @ViewChild('select') selectRef: ElementRef;
  @ViewChild('input') inputRef: ElementRef;

  select: MaterialInstanceSelect;
  userId = localStorage.getItem('userId');
  user: User;
  role = 0;
  form: FormGroup;
  image: File;
  imagePreview = '';
  paramsId = null;
  isUser = false;
  admin: User;

  constructor(private authService: AuthService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.authService.getById(this.userId).subscribe(
      admins => {
        this.admin = admins;
      }
    );
    this.form = new FormGroup({
      lastName: new FormControl(null, [Validators.required, Validators.pattern('[A-Za-zА-Яа-я]*')]),
      firstName: new FormControl(null, [Validators.required, Validators.pattern('[A-Za-zА-Яа-я]*')]),
      secondName: new FormControl(null, [Validators.pattern('[A-Za-zА-Яа-я]*')]),
      organization: new FormControl(null, Validators.minLength(0)),
      role: new FormControl(0),
      password: new FormControl(null, [Validators.minLength(6)]),
      password2: new FormControl(null)
    });
    this.form.disable();

    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isUser = true;
              this.paramsId = params['id'];
              return this.authService.getById(params['id']);
            }
            this.isUser = false;
            return this.authService.getById(this.userId);
          }
        )
      )
      .subscribe(
        (user) => {
          if (user) {
            // @ts-ignore
            this.user = user;
            this.form.patchValue({
              lastName: this.user.lastName,
              firstName: this.user.firstName,
              secondName: this.user.secondName,
              organization: this.user.organization
            });
            MaterialService.updateTextInputs();
            this.role = this.user.role ? 1 : 0;
            if (this.admin.role) {
              this.form.get('role').setValue(this.role);
              this.select = MaterialService.initSelect(this.selectRef);
            }
            this.imagePreview = this.user.imageSrc;
            MaterialService.updateTextInputs();
          }
        },
        error => {
          MaterialService.toast(error.error.message);
        }
      );

    this.form.enable();
  }

  ngOnDestroy() {
    if (this.admin.role) {
      this.select.destroy();
    }
  }

  onSubmit() {
    this.form.disable();

    const user = {
      _id: this.isUser ? this.paramsId : this.userId,
      login: this.user.login,
      lastName: this.form.value.lastName,
      firstName: this.form.value.firstName,
      secondName: this.form.value.secondName ? this.form.value.secondName : '',
      organization: this.form.value.organization ? this.form.value.organization : '',
      password: this.form.value.password ? this.form.value.password : '',
      // tslint:disable-next-line:triple-equals
      role: 1 == this.form.value.role ? true : false
    };
    this.authService.update(user, this.image).subscribe(
      newUser => {
        this.user = newUser;
        MaterialService.toast('Изменения сохранены');
      },
      error => {
        MaterialService.toast(error.error.message);
      }
    );
    this.form.enable();
  }

  triggerClick() {
    this.inputRef.nativeElement.click();
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
