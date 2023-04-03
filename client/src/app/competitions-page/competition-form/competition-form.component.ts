// noinspection TypeScriptValidateTypes

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {formatDate} from '@angular/common';
import {CompetitionsService} from '../../shared/services/competitions.service';
import {MaterialService} from '../../shared/classes/material.service';
import {Competition, User} from '../../shared/intefaces';
import {AuthService} from '../../shared/services/auth.service';
import {DatetimeService} from '../../shared/services/datetime.service';
import {isNull} from "util";

@Component({
  selector: 'app-competition-form',
  templateUrl: './competition-form.component.html',
  styleUrls: ['./competition-form.component.css']
})
export class CompetitionFormComponent implements OnInit {

  form: FormGroup;
  isNew = true;
  competition: Competition;
  date: Date;
  datetime: Date;
  user: User;

  constructor(private route: ActivatedRoute,
              private competitionsService: CompetitionsService,
              private authService: AuthService,
              private datetimeService: DatetimeService,
              private router: Router) {
  }

  ngOnInit() {

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      timeStart: new FormControl(null, [Validators.required,
        // tslint:disable-next-line:max-line-length
        Validators.pattern('[0-9]{4}-([0]{1}[1-9]{1}|[1]{1}[0-2]{1})-([0-2]{1}[0-9]{1}|[3]{1}[0-1]{1})\\s([0-1]{1}[0-9]{1}|[2]{1}[0-3]{1}):[0-5]{1}[0-9]{1}:[0-5]{1}[0-9]{1}')]),
      timeEnd: new FormControl(null, [Validators.required,
        // tslint:disable-next-line:max-line-length
        Validators.pattern('[0-9]{4}-([0]{1}[1-9]{1}|[1]{1}[0-2]{1})-([0-2]{1}[0-9]{1}|[3]{1}[0-1]{1})\\s([0-1]{1}[0-9]{1}|[2]{1}[0-3]{1}):[0-5]{1}[0-9]{1}:[0-5]{1}[0-9]{1}')])
    });

    this.form.disable();

    this.datetimeService.getDateTime().subscribe(
      (Dates) => {
        // @ts-ignore
        this.date = Dates;
        console.log('DateTimeServer', Dates);
        console.log('DateTimeServer', this.date);
        this.route.params
          .pipe(
            switchMap(
              (params: Params) => {
                if (params['id']) {
                  this.isNew = false;
                  return this.competitionsService.getById(params['id']);
                }
                return of(null);
              }
            )
          )
          .subscribe(
            (competition) => {
              if (competition) {
                // @ts-ignore
                this.competition = competition;
                this.form.patchValue({
                  name: this.competition.name,
                  timeStart: this.competition.timeStart,
                  timeEnd: this.competition.timeEnd
                });
              } else {
                this.form.patchValue({
                  timeStart: formatDate(this.date, 'yyyy-MM-dd HH:mm:ss', 'ru'),
                  timeEnd: formatDate(new Date(this.date).setHours(new Date(this.date).getHours() + 4), 'yyyy-MM-dd HH:mm:ss', 'ru')
                });
              }
              MaterialService.updateTextInputs();
              this.form.enable();
            },
            error => {
              MaterialService.toast(error.error.message);
            });
        MaterialService.updateTextInputs();
      }
    );
    this.authService.getById(localStorage.getItem('userId')).subscribe(
      (users) => {
        this.user = users;
      });
  }

  deleteCompetition() {
    const decision = window.confirm(`Вы уверены, что хотите удалить турнир ${this.competition.name}`);

    if (decision) {
      this.competitionsService.delete(this.competition._id)
        .subscribe(
          response => {
            MaterialService.toast(response.message);
          },
          error => MaterialService.toast(error.error.message),
          () => this.router.navigate(['/competition'])
        );
    }
  }

  onSubmit() {
    let obs$;
    this.form.disable();

    if (this.isNew) {
      obs$ = this.competitionsService.create(this.form.value);
    } else {
      obs$ = this.competitionsService.update(this.competition._id, this.form.value);
    }

    obs$.subscribe(
      competition => {
        MaterialService.toast('Изменения сохранены');
         if (this.isNew) {
           this.isNew = !this.isNew;
         }
        this.competition = competition;
        this.form.enable();
      },
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }
}
