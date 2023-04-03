import {Injectable} from '@angular/core';
import {Message, User} from '../intefaces';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = null;

  constructor(private http: HttpClient) {
  }

  fetch(): Observable<User[]> {
    return this.http.get<User[]>('/api/auth/');
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`/api/auth/${id}`);
  }

  update(user: User, image?: File): Observable<User> {
    const fd = new FormData();
    if (image) {
      fd.append('image', image, image.name);
    }
    fd.append('login', user.login);
    fd.append('lastName', user.lastName);
    fd.append('firstName', user.firstName);
    fd.append('secondName', user.secondName);
    fd.append('organization', user.organization);
    fd.append('password', user.password);
    // @ts-ignore
    fd.append('role', user.role);
    console.log('fd', fd.getAll('image'));

    return this.http.patch<User>(`/api/auth/${user._id}`, fd);
  }

  delete(user: User): Observable<Message> {
    return this.http.delete<Message>(`/api/auth/${user._id}`);
  }

  register(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/register', user);
  }

  login(user: User): Observable<{ token: string, userId: string}> {
    return this.http.post<{ token: string, userId: string}>('/api/auth/login', user)
      .pipe(
        tap(
          ({token, userId}) => {
            localStorage.setItem('auth-token', token);
            localStorage.setItem('userId', userId);
            this.setToken(token);
          }
        )
      );
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    this.setToken(null);
    localStorage.clear();
  }
}
