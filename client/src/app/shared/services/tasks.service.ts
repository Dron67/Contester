import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Message, Task} from '../intefaces';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  constructor(private http: HttpClient) {
  }

  getById(id: string): Observable<Task> {
    return this.http.get<Task>(`/api/task/competition/${id}`);
  }

  fetch(competitionId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`/api/task/${competitionId}`);
  }

  fetchTask(): Observable<Task[]> {
    return this.http.get<Task[]>('/api/task/');
  }

  create(task: Task): Observable<Task> {
    return this.http.post<Task>('/api/task/', task);
  }

  update(task: Task): Observable<Task> {
    return this.http.patch<Task>(`/api/task/${task._id}`, task);
  }

  delete(task: Task): Observable<Message> {
    return this.http.delete<Message>(`/api/task/${task._id}`);
  }
}
