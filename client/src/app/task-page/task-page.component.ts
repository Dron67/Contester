import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Competition, Setting, Solve, Task, User} from '../shared/intefaces';
import {TasksService} from '../shared/services/tasks.service';
import {ActivatedRoute, Params} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {MaterialInstance, MaterialInstanceSelect, MaterialService} from '../shared/classes/material.service';
import {SolveService} from '../shared/services/solve.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SettingService} from '../shared/services/setting.service';
import {AuthService} from '../shared/services/auth.service';
import {CompetitionsService} from '../shared/services/competitions.service';
import {DatetimeService} from '../shared/services/datetime.service';

@Component({
  selector: 'app-task-page',
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.css']
})
export class TaskPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('select') selectRef: ElementRef;
  @ViewChild('collapsible') collapsibleRef: ElementRef;

  select: MaterialInstanceSelect;
  collapsible: MaterialInstance;
  task: Task;
  form: FormGroup;
  language: Setting[] = [];
  solves: Solve[] = [];
  status = '';
  isCheck = false;
  solveCheck: Solve;
  isError = false;
  user: User;
  comp: Competition;
  timeServer: string;
  isTime = true;
  intervalTime: number;

  constructor(private taskService: TasksService,
              private solveService: SolveService,
              private settingService: SettingService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private competitionService: CompetitionsService,
              private datetimeService: DatetimeService) {
  }

  ngOnDestroy() {
    clearInterval(this.intervalTime);
  }

  ngOnInit() {
    this.authService.getById(localStorage.getItem('userId')).subscribe(
      users => {
        this.user = users;
      }
    );
    this.form = new FormGroup({
      language: new FormControl(0, Validators.required),
      code: new FormControl(null, Validators.required)
    });
    this.select = MaterialService.initSelect(this.selectRef);
    this.route.params.pipe(
      switchMap(
        (params: Params) => {
          return this.taskService.getById(params['id']);
        }
      )
    ).subscribe(
      (task) => {
        // @ts-ignore
        this.task = task;
        this.competitionService.getById(this.task.competition).subscribe(
          competition => {
            this.comp = competition;
            this.datetimeService.getDateTime().subscribe(
              date => {
                this.timeServer = date;
                if (new Date(this.timeServer) > new Date(this.comp.timeEnd)) {
                  this.isTime = false;
                } else {
                  this.isTime = true;
                  // @ts-ignore
                  this.intervalTime = setInterval(() => {
                    this.datetimeService.getDateTime().subscribe(
                      dateS => {
                        this.timeServer = dateS;
                        if (new Date(this.timeServer) > new Date(this.comp.timeEnd)) {
                          this.isTime = false;
                          clearInterval(this.intervalTime);
                        } else {
                          this.isTime = true;
                        }
                        console.log(this.isTime);
                      }
                    );
                  }, 10000);
                }
                console.log(this.isTime);
              }
            );
          }
        );
      },
      (error) => {
        MaterialService.toast(error.error.message);
      }
    );

    this.settingService.fetch()
      .subscribe(
        result => {
          this.language = result;
          setTimeout(
            () => {
              this.form.get('language').setValue(null);
              this.select = MaterialService.initSelect(this.selectRef);
            }, 1000
          );
        },
        error => MaterialService.toast(error.error.message)
      );

    this.route.params.pipe(
      switchMap(
        (params: Params) => {
          return this.solveService.getByTaskIdAndUserId(params['id'], localStorage.getItem('userId'));
        }
      )
    ).subscribe(
      solves => {
        // @ts-ignore
        this.solves = solves;
        this.solves.reverse();
        setTimeout(
          () => {
            this.collapsible = MaterialService.initCollapsible(this.collapsibleRef);
          }, 1000
        );
      },
      error => MaterialService.toast(error.error.message)
    );

    console.log('asdfafd');
  }


  ngAfterViewInit() {
    this.collapsible = MaterialService.initCollapsible(this.collapsibleRef);
  }

  checkAnswer(solve: Solve) {
    this.solveService.accept(solve).subscribe(
      slv => {
        console.log('message', slv.message);
        if (slv.message) {
          this.solveCheck = slv;
          setTimeout(() => {
            this.checkAnswer(this.solveCheck);
          }, 10000);
        } else {
          this.solves.unshift(slv);
          this.isCheck = false;
        }
      }
    );
  }

  onSubmit() {
    this.isCheck = true;
    const solve: Solve = {
      code: this.form.value.code,
      language: this.form.value.language,
      task: this.task._id,
      user: localStorage.getItem('userId')
    };
    this.solveService.create(solve).subscribe(
      slv => {
        this.solveCheck = slv;
        this.form.get('code').reset();
        setTimeout(
          () => {
            this.form.get('language').setValue(null);
            this.select = MaterialService.initSelect(this.selectRef);
          }, 1000
        );
        setTimeout(() => {
          this.checkAnswer(this.solveCheck);
        }, 1500);
      }
    );
  }

  onDelete(event: Event, solve: Solve) {
    event.stopPropagation();
    const decision = window.confirm(`Вы уверены, что хотите удалить решение`);

    if (decision) {
      this.solveService.delete(solve)
        .subscribe(
          response => {
            const idx = this.solves.findIndex(s => s._id === solve._id);
            this.solves.splice(idx, 1);
            MaterialService.toast(response.message);
          },
          error => MaterialService.toast(error.error.message)
        );
    }
  }

  onInfo(event: Event) {
    event.stopPropagation();
    this.isError = !this.isError;
  }

}
