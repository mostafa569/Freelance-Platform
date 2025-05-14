import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'http://localhost:9100';

  constructor(private http: HttpClient) {}

  // دالة لإضافة التوكن في الطلبات
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // لو التوكن مخزن بطريقة تانية، قوليلي
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    });
  }

  getQuestionsByExam(examId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/exams/${examId}/questions/`, { headers: this.getHeaders() });
  }

  addQuestion(examId: string, questionData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/exams/${examId}/questions/`, questionData, { headers: this.getHeaders() });
  }

  addQuestionOption(questionId: string, optionData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/questions/${questionId}/options`, optionData, { headers: this.getHeaders() });
  }

  updateQuestion(examId: string, questionId: string, questionData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/exams/${examId}/questions/${questionId}`, questionData, { headers: this.getHeaders() });
  }

  deleteQuestion(examId: string, questionId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/exams/${examId}/questions/${questionId}`, { headers: this.getHeaders() });
  }
}
