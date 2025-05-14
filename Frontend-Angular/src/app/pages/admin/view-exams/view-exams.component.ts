import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-exams',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="container">
      <div class="text-center">
        <button *ngIf="authService.getUserRole() === 'teacher'" mat-raised-button color="primary" [routerLink]="['/admin/add-exam']">Add New Exam</button>
      </div>

      <div *ngIf="exams.length === 0" class="text-center">
        <p>No exams available.</p>
      </div>

      <mat-card *ngFor="let exam of exams" class="exam-card">
        <mat-card-header>
          <mat-card-title>{{ exam.title }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>{{ exam.description }}</p>
        </mat-card-content>
        <mat-card-actions>
          <!-- زر الطالب -->
          <ng-container *ngIf="authService.getUserRole() === 'student'">
            <ng-container *ngIf="!hasAttempted(exam._id); else completedBlock">
              <button mat-button color="primary" [routerLink]="['/user-dashboard', exam._id]">Take Exam</button>
            </ng-container>
            <ng-template #completedBlock>
              <button mat-button color="accent" disabled>Completed</button>
              <button mat-stroked-button color="primary" (click)="viewResult(getAttemptId(exam._id))">View Result</button>
            </ng-template>
          </ng-container>

          <!-- أزرار المعلم -->
          <ng-container *ngIf="authService.getUserRole() === 'teacher'">
            <button mat-button color="warn" [routerLink]="['/admin/questions', exam._id, { isEditable: exam.isEditable }]" [queryParams]="{ isEditable: exam.isEditable }">Questions</button>
            <button *ngIf="exam.isEditable" mat-button color="accent" [routerLink]="['/admin/update-exam', exam._id]">Update</button>
            <button *ngIf="exam.isEditable" mat-icon-button color="warn" (click)="deleteExam(exam._id)">
              <mat-icon>delete</mat-icon>
            </button>
          </ng-container>
        </mat-card-actions>
      </mat-card>
    </div>

    <style>
      .container { padding: 20px; }
      .exam-card { margin: 20px 0; }
      .text-center { text-align: center; margin-bottom: 20px; }
    </style>
  `
})
export class ViewExamsComponent implements OnInit {
  exams: any[] = [];
  attemptsMap: { [examId: string]: any } = {};

  constructor(
    private examService: ExamService,
    public authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.examService.getExams().subscribe(
      (data) => {
        this.exams = data.exams || [];
        if (this.authService.getUserRole() === 'student') {
          this.fetchMyAttempts();
        }
      },
      (error) => {
        Swal.fire('Error!', 'Failed to load exams.', 'error');
      }
    );
  }

  fetchMyAttempts() {
    this.http.get<any>('http://localhost:9100/exams/student/my-attempts').subscribe(
      (res) => {
        // هنا التعديل عشان انت راجع array مش object
        res.forEach((attempt: any) => {
          this.attemptsMap[attempt.examId] = { _id: attempt.attemptId };
        });
        console.log('attemptsMap:', this.attemptsMap);
      },
      (error) => {
        console.error('Error fetching attempts:', error);
      }
    );
  }

  hasAttempted(examId: string): boolean {
    return !!this.attemptsMap[examId];
  }

  getAttemptId(examId: string): string {
    return this.attemptsMap[examId]?._id || '';
  }

  viewResult(attemptId: string) {
    this.router.navigate(['/user-dashboard/results', attemptId]);
  }

  deleteExam(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.examService.deleteExam(id).subscribe(
          () => {
            this.exams = this.exams.filter(exam => exam._id !== id);
            Swal.fire('Deleted!', 'Exam has been deleted.', 'success');
          },
          (error) => Swal.fire('Error!', 'Failed to delete exam.', 'error')
        );
      }
    });
  }
}
