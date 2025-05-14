import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private baseUrl = 'http://localhost:9100';

  constructor(private http: HttpClient) {}

  getResults(): Observable<any> {
    return this.http.get(`${this.baseUrl}/exams/admin/results/all`);
  }
}
