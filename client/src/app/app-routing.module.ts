import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginPageComponent} from './login-page/login-page.component';
import {AuthLayoutComponent} from './shared/layouts/auth-layout/auth-layout.component';
import {RegisterPageComponent} from './register-page/register-page.component';
import {SiteLayoutComponent} from './shared/layouts/site-layout/site-layout.component';
import {AuthGuard} from './shared/classes/auth.guard';
import {CompetitionsPageComponent} from './competitions-page/competitions-page.component';
import {CompetitionFormComponent} from './competitions-page/competition-form/competition-form.component';
import {ProfilePageComponent} from './profile-page/profile-page.component';
import {MembersPageComponent} from './members-page/members-page.component';
import {MembersFormComponent} from './members-page/members-form/members-form.component';
import {TaskPageComponent} from './task-page/task-page.component';
import {SettingPageComponent} from './setting-page/setting-page.component';
import {SettingFormComponent} from './setting-page/setting-form/setting-form.component';
import {HelpPageComponent} from './help-page/help-page.component';
import {AboutPageComponent} from './about-page/about-page.component';
import {CompetitionsTablePageComponent} from './competitions-table-page/competitions-table-page.component';

const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      {path: '', redirectTo: '/login', pathMatch: 'full'},
      {path: 'login', component: LoginPageComponent},
      {path: 'register', component: RegisterPageComponent}
    ]
  },
  {
    path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
      {path: 'setting', component: SettingPageComponent},
      {path: 'setting/new', component: SettingFormComponent},
      {path: 'setting/:id', component: SettingFormComponent},
      {path: 'competition', component: CompetitionsPageComponent},
      {path: 'competition/new', component: CompetitionFormComponent},
      {path: 'competition/:id', component: CompetitionFormComponent},
      {path: 'profile', component: ProfilePageComponent},
      {path: 'profile/:id', component: ProfilePageComponent},
      {path: 'members', component: MembersPageComponent},
      {path: 'members/:id', component: MembersFormComponent},
      {path: 'task/:id', component: TaskPageComponent},
      {path: 'help', component: HelpPageComponent},
      {path: 'about', component: AboutPageComponent},
      {path: 'competitions/table/:id', component: CompetitionsTablePageComponent}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
