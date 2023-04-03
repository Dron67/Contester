import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Message, Test} from '../intefaces';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  constructor(private http: HttpClient) {
  }

  getByTaskId(id: string): Observable<Test[]> {
    return this.http.get<Test[]>(`/api/test/${id}`);
  }

  create(test: Test): Observable<Test> {
    return this.http.post<Test>('/api/test/', test);
  }

  update(test: Test): Observable<Test> {
    return this.http.patch<Test>(`/api/test/${test._id}`, test);
  }

  delete(test: Test): Observable<Message> {
    return this.http.delete<Message>(`/api/test/${test._id}`);
  }
}
