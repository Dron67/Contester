import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {User} from '../shared/intefaces';
import {MaterialService} from '../shared/classes/material.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-members-page',
  templateUrl: './members-page.component.html',
  styleUrls: ['./members-page.component.css']
})
export class MembersPageComponent implements OnInit {
  @ViewChild('input') inputRef: ElementRef;

  members: User[] = [];
  loading = false;
  user: User;

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    this.loading = true;
    this.authService.getById(localStorage.getItem('userId')).subscribe(
      users => {
        this.user = users;
      }
    );
    this.authService.fetch().subscribe(users => {
      this.members = users;
      this.loading = false;
    });
  }

  onEditUser(event: Event, user: User) {
    event.stopPropagation();
    this.router.navigate(['/profile', user._id]);
  }

  onSelectUser(user: User) {
    this.router.navigate(['/members', user._id]);
  }

  onDeleteUser(event: Event, user: User) {
    event.stopPropagation();
    const decision = window.confirm('Вы уверены, что хотите удалить участника?');

    if (decision) {
      this.authService.delete(user).subscribe(
        response => {
          const idx = this.members.findIndex(t => t._id === user._id);
          this.members.splice(idx, 1);
          MaterialService.toast(response.message);
        },
        error => {
          MaterialService.toast(error.error.message);
        }
      );
    }
  }

  triggeredClick() {
    this.inputRef.nativeElement.click();
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      const usersList = reader.result.split('\n');
      for (const users of usersList) {
        const candidates = users.split(';');
        const candidat = {
          login: candidates[0],
          lastName: candidates[1],
          firstName: candidates[2],
          secondName: candidates[3],
          organization: candidates[4],
          password: candidates[5].replace('\r', '')
        };
        this.authService.register(candidat).subscribe(
          (newUser) => {
              this.members.push(newUser);
          }, error => MaterialService.toast(error.error.message)
        );
      }
    };
  }
}
