import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../../services/question.service';
import { ExamService } from '../../../services/exam.service';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-start-quiz',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatRadioModule, HttpClientModule, FormsModule],
  template: `
    <div class="container">
      <mat-card *ngFor="let question of questions; let i = index" class="question-card">
        <mat-card-content>
          <h3>Question {{ i + 1 }}: {{ question.questionText }}</h3>
          <mat-radio-group [(ngModel)]="question.selectedOptionId">
            <mat-radio-button *ngFor="let option of question.options" [value]="option._id">
              {{ option.optionText }}
            </mat-radio-button>
          </mat-radio-group>
        </mat-card-content>
      </mat-card>
      <div class="text-center">
        <button mat-raised-button color="primary" (click)="submitExam()">Submit Exam</button>
      </div>
    </div>
    <style>
      .container { padding: 20px; }
      .question-card { margin: 20px 0; }
      .text-center { text-align: center; margin-top: 20px; }
    </style>
  `
})
export class StartQuizComponent implements OnInit {
  examId: string | null = null;
  questions: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private examService: ExamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get examId from route parameters
    this.examId = this.route.snapshot.paramMap.get('examId');
    if (this.examId) {
      // Fetch questions for the exam
      this.questionService.getQuestionsByExam(this.examId).subscribe(
        (data: any) => {
          this.questions = data.allQuestions || [];
          console.log('Questions loaded:', this.questions);
        },
        (error: HttpErrorResponse) => {
          console.error('Error fetching questions:', error);
          Swal.fire('Error!', 'Failed to load questions.', 'error');
        }
      );
    } else {
      // Show error if examId is missing
      Swal.fire('Error!', 'Exam ID is missing.', 'error');
      this.router.navigate(['/']);
    }
  }

  isSubmitting: boolean = false;

submitExam(): void {
  // تأكد من وجود examId
  const examId = this.examId;
  if (!examId) {
    Swal.fire('Error', 'Exam ID is missing', 'error');
    return;
  }

  // جلب معلومات المستخدم
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user._id;
  if (!userId) {
    Swal.fire('Error', 'Please log in first', 'error');
    this.router.navigate(['/login']);
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    Swal.fire('Error', 'Authentication token is missing. Please log in again.', 'error');
    this.router.navigate(['/login']);
    return;
  }

  // التحقق إن كل سؤال مجاوب عليه
  const unanswered = this.questions.find(q => !q.selectedOptionId);
  if (unanswered) {
    Swal.fire('Warning', 'Please answer all questions before submitting.', 'warning');
    return;
  }

  // منع التقديم المتكرر
  if (this.isSubmitting) return;
  this.isSubmitting = true;

  // إعداد البيانات
  const attempt = {
    examId: examId,
    userId: userId,
    answers: this.questions.map(q => ({
      questionId: q._id,
      selectedOptionId: q.selectedOptionId
    }))
  };

  // إرسال الطلب
  this.examService.submitExam(examId, attempt).subscribe(
    (response: any) => {
      this.isSubmitting = false;

      if (response.attemptId) {
        Swal.fire('Success', 'Exam submitted successfully', 'success');
        this.router.navigate(['user-dashboard/results', response.attemptId]);
      } else {
        Swal.fire('Error', 'Invalid response from server: attemptId is missing', 'error');
      }
    },
    (error: HttpErrorResponse) => {
      this.isSubmitting = false;

      const message = error.error?.message || error.statusText || 'Unknown error occurred';
      Swal.fire('Error', `Failed to submit exam: ${message}`, 'error');
    }
  );
}

}
