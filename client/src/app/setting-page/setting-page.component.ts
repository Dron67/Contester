import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Setting} from '../shared/intefaces';
import {SettingService} from '../shared/services/setting.service';

@Component({
  selector: 'app-setting-page',
  templateUrl: './setting-page.component.html',
  styleUrls: ['./setting-page.component.css']
})
export class SettingPageComponent implements OnInit {

  settings$: Observable<Setting[]>;

  constructor(private settingService: SettingService) {
  }

  ngOnInit() {
    this.settings$ = this.settingService.fetch();
  }

}
