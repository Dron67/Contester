import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {SolveService} from '../../../shared/services/solve.service';
import {Solve, Task, User} from '../../../shared/intefaces';
import {MaterialInstance, MaterialService} from '../../../shared/classes/material.service';
import {Router} from '@angular/router';
import {TasksService} from '../../../shared/services/tasks.service';
import {AuthService} from '../../../shared/services/auth.service';


@Component({
  selector: 'app-alltry-page',
  templateUrl: './alltry-page.component.html',
  styleUrls: ['./alltry-page.component.css']
})
export class AlltryPageComponent implements OnInit {
  @Input('userId') userId: string;
  @ViewChild('collapsible') collapsibleRef: ElementRef;

  solves: Solve[];
  collapsible: MaterialInstance;
  loading: Boolean;
  tasks: Task[];
  user: User;
  isError = false;

  constructor(private solveService: SolveService,
              private router: Router,
              private taskService: TasksService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.loading = true;
    this.authService.getById(localStorage.getItem('userId')).subscribe(
      users => {
        this.user = users;
      }
    );
    this.taskService.fetchTask().subscribe(
      task => {
        this.tasks = task;
      },
      error => MaterialService.toast(error.error.message)
    );
    this.solveService.getByUserId(this.userId)
      .subscribe(
        Solves => {
          this.solves = Solves;
          this.solves.reverse();
          if (this.solves.length !== 0) {
            for (const solve of this.solves) {
              const indx = this.tasks.findIndex(t => t._id === solve.task);
              if (indx !== -1) {
                solve.taskName = this.tasks[indx].name;
                const index = this.solves.findIndex(t => t._id === solve._id);
                this.solves[index] = solve;
                console.log(solve);
              }
            }
          }
          setTimeout(
            () => {
              this.collapsible = MaterialService.initCollapsible(this.collapsibleRef);
            }, 2000
          );
          this.loading = false;
        },
        error => {
          MaterialService.toast(error.error.message);
          this.loading = false;
        }
      );
  }

  onTask(solve: Solve) {
    this.router.navigate(['/task', solve.task]);
  }

  onInfo(event: Event) {
    event.stopPropagation();
    this.isError = !this.isError;
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
}
