import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Message, Solve} from '../intefaces';

@Injectable({
  providedIn: 'root'
})
export class SolveService {

  constructor(private http: HttpClient) {
  }

  create(solve: Solve): Observable<Solve> {
    return this.http.post<Solve>('/api/solve/', solve);
  }

  getByTaskIdAndUserId(taskId: string, userId: string): Observable<Solve[]> {
    return this.http.get<Solve[]>(`/api/solve/${taskId}/${userId}`);
  }

  getByUserId(userId: string): Observable<Solve[]> {
    return this.http.get<Solve[]>(`/api/solve/${userId}`);
  }

  delete(solve: Solve): Observable<Message> {
    return this.http.delete<Message>(`/api/solve/${solve._id}`);
  }

  accept(solve: Solve): Observable<Solve> {
    return this.http.post<Solve>('/api/solve/accept', solve);
  }
}
