import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
  }
)
export class DatetimeService {
  constructor(private http: HttpClient) {
  }

  getDateTime(): Observable<string> {
    return this.http.get<string>('/api/datetime');
  }
}
