import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPrintModule} from 'ngx-print'


import {AppComponent} from './app.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {AppRoutingModule} from './app-routing.module';
import {AuthLayoutComponent} from './shared/layouts/auth-layout/auth-layout.component';
import {RegisterPageComponent} from './register-page/register-page.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TokenInterceptor} from './shared/classes/token.interceptor';
import {LoaderComponent} from './shared/components/loader/loader.component';
import {CompetitionsPageComponent} from './competitions-page/competitions-page.component';
import {SiteLayoutComponent} from './shared/layouts/site-layout/site-layout.component';
import {CompetitionFormComponent} from './competitions-page/competition-form/competition-form.component';
import {TasksFormComponent} from './competitions-page/competition-form/tasks-form/tasks-form.component';
import {ProfilePageComponent} from './profile-page/profile-page.component';
import {MembersPageComponent} from './members-page/members-page.component';
import {MembersFormComponent} from './members-page/members-form/members-form.component';
import {TaskPageComponent} from './task-page/task-page.component';
import { SettingPageComponent } from './setting-page/setting-page.component';
import { SettingFormComponent } from './setting-page/setting-form/setting-form.component';
import localeRu from '@angular/common/locales/ru';
import {registerLocaleData} from '@angular/common';
import { HelpPageComponent } from './help-page/help-page.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { AlltryPageComponent } from './members-page/members-form/alltry-page/alltry-page.component';
import { CompetitionsTablePageComponent } from './competitions-table-page/competitions-table-page.component';

registerLocaleData(localeRu);

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthLayoutComponent,
    RegisterPageComponent,
    LoaderComponent,
    SiteLayoutComponent,
    CompetitionsPageComponent,
    CompetitionFormComponent,
    TasksFormComponent,
    ProfilePageComponent,
    MembersPageComponent,
    MembersFormComponent,
    TaskPageComponent,
    SettingPageComponent,
    SettingFormComponent,
    HelpPageComponent,
    AboutPageComponent,
    AlltryPageComponent,
    CompetitionsTablePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPrintModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor
    },
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
