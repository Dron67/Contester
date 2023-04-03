import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Table} from '../intefaces';

@Injectable({
  providedIn: 'root'
})

export class TableService {
  constructor(private http: HttpClient) {
  }

  fetch(id: string): Observable<Table> {
    return this.http.get<Table>(`/api/table/${id}`);
  }
}
