import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Setting} from '../../shared/intefaces';
import {SettingService} from '../../shared/services/setting.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {MaterialService} from '../../shared/classes/material.service';
import {error} from "protractor";

@Component({
  selector: 'app-setting-form',
  templateUrl: './setting-form.component.html',
  styleUrls: ['./setting-form.component.css']
})
export class SettingFormComponent implements OnInit {

  form: FormGroup;
  isNew = true;
  setting: Setting;

  constructor(private settingService: SettingService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      file: new FormControl(null, Validators.required),
      commander: new FormControl(null, Validators.required)
    });

    this.form.disable();

    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isNew = false;
              return this.settingService.getById(params['id']);
            }
            return of(null);
          }
        )
      )
      .subscribe(
        (setting) => {
          if (setting) {
            // @ts-ignore
            this.setting = setting;
            console.log('set', this.setting);
            this.form.patchValue({
              name: this.setting.name,
              file: this.setting.file,
              commander: this.setting.commander
            });
            MaterialService.updateTextInputs();
          }
          this.form.enable();
        },
        error => {
          MaterialService.toast(error.error.message);
        }
      );
  }

  deleteSetting() {
    const decision = window.confirm(`Вы уверены, что хотите удалить компилятор ${this.setting.name}`);
    if (decision) {
      this.settingService.delete(this.setting._id)
        .subscribe(
          response => {
            MaterialService.toast(response.message);
          },
          error => MaterialService.toast(error.error.message),
          () => this.router.navigate(['/setting'])
        );
    }
  }

  onSubmit() {
    let obs$;
    this.form.disable();

    if (this.isNew) {
      obs$ = this.settingService.create(this.form.value);
    } else {
      obs$ = this.settingService.update(this.setting._id, this.form.value);
    }

    obs$.subscribe(
      setting => {
        MaterialService.toast('Изменения сохранены');
        this.setting = setting;
        this.form.enable();
      },
      // tslint:disable-next-line:no-shadowed-variable
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }

}
