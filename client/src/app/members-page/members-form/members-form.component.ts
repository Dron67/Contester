import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {AuthService} from '../../shared/services/auth.service';
import {User} from '../../shared/intefaces';
import {MaterialService} from '../../shared/classes/material.service';

@Component({
  selector: 'app-members-form',
  templateUrl: './members-form.component.html',
  styleUrls: ['./members-form.component.css']
})
export class MembersFormComponent implements OnInit {

  user: User;

  constructor(private route: ActivatedRoute,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            return this.authService.getById(params['id']);
          }
        )
      )
      .subscribe(
        (user) => {
          // @ts-ignore
          this.user = user;

        },
        error => {
          MaterialService.toast(error.error.message);
        }
      );
  }

}
