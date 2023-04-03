import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Message, Competition} from '../intefaces';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompetitionsService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<Competition[]> {
    return this.http.get<Competition[]>('/api/competition/');
  }

  getById(id: string): Observable<Competition> {
    return this.http.get<Competition>(`/api/competition/${id}`);
  }

  create(competition: Competition): Observable<Competition> {
    return this.http.post<Competition>('/api/competition/', competition);
  }

  update(id: string, competition: Competition): Observable<Competition> {
    return this.http.patch<Competition>(`/api/competition/${id}`, competition);
  }

  delete(id: string): Observable<Message> {
    return this.http.delete<Message>(`/api/competition/${id}`);
  }
}
