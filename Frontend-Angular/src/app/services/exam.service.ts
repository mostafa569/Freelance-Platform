import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private baseUrl = 'http://localhost:9100';

  constructor(private http: HttpClient) {}

  // دالة لإضافة التوكن في الطلبات
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // لو التوكن مخزن بطريقة تانية، قوليلي
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
  }

  getExams(): Observable<any> {
    return this.http.get(`${this.baseUrl}/exams`, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error fetching exams:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch exams'));
      })
    );
  }

  getExamById(examId: string): Observable<any> {
    if (!examId || examId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(examId)) {
      return throwError(() => new Error('Invalid exam ID format'));
    }
    return this.http.get(`${this.baseUrl}/exams/${examId}`, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error fetching exam:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch exam'));
      })
    );
  }

  addExam(exam: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/exams/create/`, exam, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error adding exam:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to add exam'));
      })
    );
  }

  updateExam(id: string, exam: any): Observable<any> {
    if (!id || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return throwError(() => new Error('Invalid exam ID format'));
    }
    return this.http.put(`${this.baseUrl}/exams/update/${id}`, exam, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error updating exam:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to update exam'));
      })
    );
  }

  deleteExam(id: string): Observable<any> {
    if (!id || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return throwError(() => new Error('Invalid exam ID format'));
    }
    return this.http.delete(`${this.baseUrl}/exams/delete/${id}`, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error deleting exam:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to delete exam'));
      })
    );
  }
  submitExam(examId: string, attempt: any): Observable<any> {
    if (!examId || examId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(examId)) {
      return throwError(() => new Error('Invalid exam ID format'));
    }
    return this.http.post(`${this.baseUrl}/exams/submit/${examId}`, attempt, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error submitting exam:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to submit exam'));
      })
    );
  }
}
