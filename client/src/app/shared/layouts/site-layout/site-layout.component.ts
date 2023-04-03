import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from '../../classes/material.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {User} from '../../intefaces';


@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('sidenav') sidenavRef: ElementRef;

  sidenav: MaterialInstance;
  links = [
    {url: '/competition', name: 'Турниры', icons: 'flag'},
    {url: '/members', name: 'Участники', icons: 'people'},
    {url: '/help', name: 'Помощь', icons: 'help'},
    {url: '/about', name: 'О нас', icons: 'info_outline'}
  ];
  fio = '';
  imagePreview = '';
  user: User;
  isSwOn = false;

  constructor(private auth: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    this.auth.getById(localStorage.getItem('userId')).subscribe(
      newUser => {
        this.user = newUser;
      }
    );
  }

  ngOnDestroy() {
    this.sidenav.destroy();
  }

  ngAfterViewInit() {
    this.sidenav = MaterialService.initSidenav(this.sidenavRef);
  }

  onSidenavOpen() {
    this.auth.getById(localStorage.getItem('userId')).subscribe(
      newUser => {
        this.user = newUser;
      }
    );
    this.fio = `${this.user.lastName} ${this.user.firstName} ${this.user.secondName}`;
    this.imagePreview = this.user.imageSrc;
    this.sidenav.open();
  }

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  onSidenavClose() {
    this.sidenav.close();
  }

  switchClick() {
    this.isSwOn = !this.isSwOn;
  }

}
