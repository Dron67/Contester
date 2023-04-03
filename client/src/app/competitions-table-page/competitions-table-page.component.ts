import {Component, OnDestroy, OnInit} from '@angular/core';
import {TableService} from '../shared/services/table.service';
import {ActivatedRoute, Params} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {Task} from '../shared/intefaces';
import {TasksService} from '../shared/services/tasks.service';
import {DatetimeService} from '../shared/services/datetime.service';
import {CompetitionsService} from '../shared/services/competitions.service';
import {formatDate} from '@angular/common';
import {toNumbers} from '@angular/compiler-cli/src/diagnostics/typescript_version';


@Component({
  selector: 'app-competitions-table-page',
  templateUrl: './competitions-table-page.component.html',
  styleUrls: ['./competitions-table-page.component.css']
})
export class CompetitionsTablePageComponent implements OnInit, OnDestroy {

  Tablet = [];
  Tasks: Task[];
  mesto = 1;
  TimeStart: string;
  TimeEnd: string;
  dostupno = true;
  konch = false;
  up = true;
  start: Date;
  end: Date;
  competitionId: string;
  timeUp: any;
  tableUp: any;

  constructor(private tableService: TableService,
              private route: ActivatedRoute,
              private taskService: TasksService,
              private datetimeService: DatetimeService,
              private competitionService: CompetitionsService) {
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.competitionId = params['id'];
              this.taskService.fetch(params['id']).subscribe(
                tasks => {
                  this.Tasks = tasks;
                }
              );
              console.log('pltcm');
              this.competitionService.getById(params['id']).subscribe(
                competition => {
                  this.datetimeService.getDateTime().subscribe(
                    (datetime) => {
                      console.log('fdg');
                      if (new Date(competition.timeStart) > new Date(datetime)) {
                        this.dostupno = false;
                      } else if (new Date(competition.timeEnd) < new Date(datetime)) {
                        this.konch = true;
                      } else {
                        const dateServer = formatDate(new Date(datetime), 'yyyy-MM-dd HH:mm:ss', 'ru');
                        const dateServ = dateServer.split(' ');
                        const dateS = dateServ[0].split('-');
                        const timeS = dateServ[1].split(':');
                        const dateCompetitionStart = formatDate(new Date(competition.timeStart), 'yyyy-MM-dd HH:mm:ss', 'ru');
                        const dateCompSt = dateCompetitionStart.split(' ');
                        const dateCSt = dateCompSt[0].split('-');
                        const timeCSt = dateCompSt[1].split(':');
                        const dateCompetitionEnd = formatDate(new Date(competition.timeEnd), 'yyyy-MM-dd HH:mm:ss', 'ru');
                        const dateCompEnd = dateCompetitionEnd.split(' ');
                        const dateCEnd = dateCompEnd[0].split('-');
                        const timeCEnd = dateCompEnd[1].split(':');
                        console.log(toNumbers(dateS[0]));
                        this.TimeStart = formatDate(new Date(toNumbers(dateS[0])[0] -
                          toNumbers(dateCSt[0])[0], toNumbers(dateS[1])[0] -
                          toNumbers(dateCSt[1])[0], toNumbers(dateS[2])[0] -
                          toNumbers(dateCSt[2])[0], toNumbers(timeS[0])[0] -
                          toNumbers(timeCSt[0])[0], toNumbers(timeS[1])[0] -
                          toNumbers(timeCSt[1])[0], toNumbers(timeS[2])[0] -
                          toNumbers(timeCSt[2])[0]), 'HH:mm:ss', 'ru');
                        console.log(this.TimeStart);
                        this.TimeEnd = formatDate(new Date(toNumbers(dateCEnd[0])[0] -
                          toNumbers(dateS[0])[0], toNumbers(dateCEnd[1])[0] -
                          toNumbers(dateS[1])[0], toNumbers(dateCEnd[2])[0] -
                          toNumbers(dateS[2])[0], toNumbers(timeCEnd[0])[0] -
                          toNumbers(timeS[0])[0], toNumbers(timeCEnd[1])[0] -
                          toNumbers(timeS[1])[0], toNumbers(timeCEnd[2])[0] -
                          toNumbers(timeS[2])[0]), 'HH:mm:ss', 'ru');
                        this.start = new Date(toNumbers(dateS[0])[0] -
                          toNumbers(dateCSt[0])[0], toNumbers(dateS[1])[0] -
                          toNumbers(dateCSt[1])[0], toNumbers(dateS[2])[0] -
                          toNumbers(dateCSt[2])[0], toNumbers(timeS[0])[0] -
                          toNumbers(timeCSt[0])[0], toNumbers(timeS[1])[0] -
                          toNumbers(timeCSt[1])[0], toNumbers(timeS[2])[0] -
                          toNumbers(timeCSt[2])[0]);
                        this.end = new Date(toNumbers(dateCEnd[0])[0] -
                          toNumbers(dateS[0])[0], toNumbers(dateCEnd[1])[0] -
                          toNumbers(dateS[1])[0], toNumbers(dateCEnd[2])[0] -
                          toNumbers(dateS[2])[0], toNumbers(timeCEnd[0])[0] -
                          toNumbers(timeS[0])[0], toNumbers(timeCEnd[1])[0] -
                          toNumbers(timeS[1])[0], toNumbers(timeCEnd[2])[0] -
                          toNumbers(timeS[2])[0]);
                        this.timeUp = setInterval(() => this.timeUpdate(), 1000);
                        this.tableUp = setInterval(() => this.tableUpdate(), 18000);
                      }
                      console.log('pfrjyxbkcz');
                    }
                  );
                }
              );
              return this.tableService.fetch(params['id']);
            }
            return of(null);
          }
        )
      ).subscribe(
      (table) => {
        const sor = Object.keys(table).sort((a, b) => {
          return table[a].ball - table[b].ball;
        });
        //this.mesto = sor.length;
        for (const key of sor) {
          if (!table[key].isAccept) {
            table[key].mesto = 0;
          } else {
            table[key].mesto = this.mesto;
          }
          this.mesto += 1;
          this.Tablet.push(table[key]);
        }
        //this.Tablet.reverse();
      }
    );
  }

  ngOnDestroy() {
    if (this.up) {
      clearInterval(this.timeUp);
      clearInterval(this.tableUp);
    }
  }

  timeUpdate() {
    this.TimeStart = formatDate(this.start.setSeconds(this.start.getSeconds() + 1), 'HH:mm:ss', 'ru');
    this.TimeEnd = formatDate(this.end.setSeconds(this.end.getSeconds() - 1), 'HH:mm:ss', 'ru');
    if (this.end.getHours() === 0 && this.end.getMinutes() === 0 && this.end.getSeconds() === 0) {
      clearInterval(this.timeUp);
      clearInterval(this.tableUp);
      this.konch = true;
      this.up = false;
    }
  }

  tableUpdate() {
    this.Tablet = [];
    this.tableService.fetch(this.competitionId).subscribe(
      (table) => {
        const sor = Object.keys(table).sort((a, b) => {
          return table[a].ball - table[b].ball;
        });
        //this.mesto = sor.length;
        this.mesto = 1;
        for (const key of sor) {
          if (!table[key].isAccept) {
            table[key].mesto = 0;
          } else {
            table[key].mesto = this.mesto;
          }
          this.mesto += 1;
          this.Tablet.push(table[key]);
        }
        //this.Tablet.reverse();
      }
    );
  }
}
