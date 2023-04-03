import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TasksService} from '../../../shared/services/tasks.service';
import {Task, Test, User} from '../../../shared/intefaces';
import {MaterialInstance, MaterialInstanceSelect, MaterialService} from '../../../shared/classes/material.service';
import {TestService} from '../../../shared/services/test.service';
import {SettingService} from '../../../shared/services/setting.service';
import {AuthService} from '../../../shared/services/auth.service';
import {CompetitionsService} from '../../../shared/services/competitions.service';
import {DatetimeService} from '../../../shared/services/datetime.service';

@Component({
  selector: 'app-tasks-form',
  templateUrl: './tasks-form.component.html',
  styleUrls: ['./tasks-form.component.css']
})
export class TasksFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('competitionId') competitionId: string;
  @ViewChild('modal') modalRef: ElementRef;
  @ViewChild('modalTest') modalTestRef: ElementRef;
  @ViewChild('collapsible') collapsibleRef: ElementRef;
  @ViewChild('select') selectRef: ElementRef;

  tasks: Task[] = [];
  tests: Test[] = [];
  loading = false;
  taskId = null;
  testId = null;
  language = [];
  select: MaterialInstanceSelect;
  modal: MaterialInstance;
  modalTest: MaterialInstance;
  collapsible: MaterialInstance;
  form: FormGroup;
  formTest: FormGroup;
  user: User;

  constructor(private taskService: TasksService,
              private testService: TestService,
              private settingService: SettingService,
              private authService: AuthService,
              private router: Router,
              private competitionService: CompetitionsService,
              private datetimeService: DatetimeService) {
  }

  ngOnInit() {
    this.authService.getById(localStorage.getItem('userId')).subscribe(
      (users) => {
        this.user = users;
      });

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      condition: new FormControl(null, Validators.required),
      limitTime: new FormControl(0, [Validators.required, Validators.min(0)]),
      limitMemory: new FormControl(0, [Validators.required, Validators.min(0)]),
      checker: new FormControl(null, Validators.required),
      language: new FormControl(0, Validators.required)
    });

    this.formTest = new FormGroup({
      input: new FormControl(null, Validators.required),
      pattern: new FormControl(null, Validators.minLength(0)),
    });
    this.loading = true;
    this.settingService.fetch()
      .subscribe(
        result => {
          this.language = result;
          setTimeout(
            () => {
              this.form.get('language').setValue(null);
              this.select = MaterialService.initSelect(this.selectRef);
            }, 2000
          );
        },
        error => MaterialService.toast(error.error.message)
      );

    this.taskService.fetch(this.competitionId).subscribe(tasks => {
      this.tasks = tasks;
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.modal.destroy();
    this.modalTest.destroy();
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
    this.modalTest = MaterialService.initModal(this.modalTestRef);
    this.collapsible = MaterialService.initCollapsible(this.collapsibleRef);
    this.select = MaterialService.initSelect(this.selectRef);
  }

  onSelectTack(task: Task) {
    this.competitionService.getById(this.competitionId).subscribe(
      competition => {
        this.datetimeService.getDateTime().subscribe(
          timeServer => {
            if (new Date(timeServer) > new Date(competition.timeStart)) {
              this.router.navigate(['/task', task._id]);
            }
          }
        );
      }
    );
  }

  onEditTask(event: Event, task: Task) {
    event.stopPropagation();
    this.taskId = task._id;
    this.form.patchValue({
      name: task.name,
      condition: task.condition,
      limitTime: task.limitTime,
      limitMemory: task.limitMemory,
      checker: task.checker
    });
    this.form.get('language').setValue(task.language);
    this.testService.getByTaskId(this.taskId).subscribe(
      tests => this.tests = tests
    );
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onAddTask() {
    this.taskId = null;
    this.form.reset({
      name: null,
      condition: null,
      limitTime: 0,
      limitMemory: 0,
      checker: null
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onDeleteTask(event: Event, task: Task) {
    event.stopPropagation();
    const decision = window.confirm(`Вы уверены, что хотите удалить задачу "${task.name}"?`);

    if (decision) {
      this.taskService.delete(task).subscribe(
        response => {
          const idx = this.tasks.findIndex(t => t._id === task._id);
          this.tasks.splice(idx, 1);
          MaterialService.toast(response.message);
        },
        error => {
          MaterialService.toast(error.error.message);
        }
      );
    }
  }

  onCancel() {
    this.modal.close();
  }

  onSubmit() {
    this.form.disable();

    const newTask: Task = {
      name: this.form.value.name,
      condition: this.form.value.condition,
      competition: this.competitionId,
      limitTime: this.form.value.limitTime,
      limitMemory: this.form.value.limitMemory,
      checker: this.form.value.checker,
      language: this.form.get('language').value
    };

    const completed = () => {
      this.modal.close();
      this.form.reset({name: '', condition: '', limitTime: 0, limitMemory: 0, checker: ''});
      this.form.enable();
    };

    if (this.taskId) {
      newTask._id = this.taskId;
      this.taskService.update(newTask).subscribe(
        task => {
          const idx = this.tasks.findIndex(t => t._id === task._id);
          this.tasks[idx] = task;
          MaterialService.toast('Изменения сохранены');
        },
        error => {
          MaterialService.toast(error.error.message);
        },
        completed
      );
    } else {
      this.taskService.create(newTask).subscribe(
        task => {
          MaterialService.toast('Задача создана');
          this.tasks.push(task);
        },
        error => {
          MaterialService.toast(error.error.message);
        },
        completed
      );
    }
    this.collapsible = MaterialService.initCollapsible(this.collapsibleRef);
  }

  onAddTest() {
    this.formTest.reset({
      input: '',
      pattern: ''
    });
    this.modalTest.open();
    this.collapsible = MaterialService.initCollapsible(this.collapsibleRef);
  }

  onEditTest(event: Event, test: Test) {
    event.stopPropagation();
    this.testId = test._id;
    this.formTest.patchValue({
      input: test.input,
      pattern: test.pattern
    });
    MaterialService.updateTextInputs();
  }

  onDeleteTest(event: Event, test: Test) {
    event.stopPropagation();
    const decision = window.confirm(`Вы уверены, что хотите удалить тестовую пару"?`);

    if (decision) {
      this.testService.delete(test).subscribe(
        response => {
          const idx = this.tests.findIndex(t => t._id === test._id);
          this.tests.splice(idx, 1);
          MaterialService.toast(response.message);
        },
        error => {
          MaterialService.toast(error.error.message);
        }
      );
    }
  }

  onSubmitTest() {
    this.formTest.disable();

    const newTest: Test = {
      input: this.formTest.value.input,
      pattern: this.formTest.value.pattern,
      task: this.taskId
    };
    const completed = () => {
      this.formTest.reset({input: '', pattern: ''});
      this.formTest.enable();
    };

    if (this.testId) {
      newTest._id = this.testId;
      this.testService.update(newTest).subscribe(
        test => {
          const idx = this.tests.findIndex(t => t._id === test._id);
          this.tests[idx] = test;
          MaterialService.toast('Изменения сохранены');
        },
        error => {
          MaterialService.toast(error.error.message);
        },
        completed
      );
    } else {
      this.testService.create(newTest).subscribe(
        test => {
          MaterialService.toast('Тестовая пара добавлена');
          this.tests.push(test);
        },
        error => {
          MaterialService.toast(error.error.message);
        },
        completed
      );
    }
  }


  onCancelTest() {
    this.modalTest.close();
  }
}
