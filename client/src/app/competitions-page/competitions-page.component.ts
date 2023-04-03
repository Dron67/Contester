import {Component, OnInit} from '@angular/core';
import {CompetitionsService} from '../shared/services/competitions.service';
import {Competition, User} from '../shared/intefaces';
import {Observable} from 'rxjs';
import {AuthService} from '../shared/services/auth.service';

@Component({
  selector: 'app-competitions-page',
  templateUrl: './competitions-page.component.html',
  styleUrls: ['./competitions-page.component.css']
})
export class CompetitionsPageComponent implements OnInit {

  competition$: Observable<Competition[]>;
  user: User;

  constructor(private competitionsService: CompetitionsService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getById(localStorage.getItem('userId')).subscribe(
      users => {
        this.user = users;
      }
    );
    this.competition$ = this.competitionsService.fetch();
  }

}
