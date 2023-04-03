import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AuthService} from '../shared/services/auth.service';
import {MaterialService} from '../shared/classes/material.service';


@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  aSub: Subscription;

  constructor(private auth: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      login: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required, Validators.pattern('[A-Za-zА-Яа-я\']*')]),
      firstName: new FormControl(null, [Validators.required, Validators.pattern('[A-Za-zА-Яа-я\']*')]),
      secondName: new FormControl(null, [Validators.pattern('[A-Za-zА-Яа-я\']*')]),
      organization: new FormControl(null, [Validators.minLength(0)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      password2: new FormControl(null, [Validators.required])
    });
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  onSubmit() {
    this.form.disable();
    const user = {
      login: this.form.value.login,
      lastName: this.form.value.lastName,
      firstName: this.form.value.firstName,
      secondName: this.form.value.secondName ? this.form.value.secondName : '',
      organization: this.form.value.organization ? this.form.value.organization : '',
      password: this.form.value.password
    };
    this.aSub = this.auth.register(user).subscribe(
      () => {
        this.router.navigate(['/login'], {
          queryParams: {
            registered: true
          }
        });
      },
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }

}
