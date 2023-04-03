import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Message, Setting} from '../intefaces';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<Setting[]> {
    return this.http.get<Setting[]>('/api/setting/');
  }

  getById(id: string): Observable<Setting> {
    return this.http.get<Setting>(`/api/setting/${id}`);
  }

  delete(id: string): Observable<Message> {
    return this.http.delete<Message>(`/api/setting/${id}`);
  }

  create(setting: Setting): Observable<Setting> {
    return this.http.post<Setting>('/api/setting/', setting);
  }

  update(id: string, setting: Setting): Observable<Setting> {
    return this.http.patch<Setting>(`/api/setting/${id}`, setting);
  }
}
