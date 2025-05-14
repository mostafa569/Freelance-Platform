import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../../../services/question.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-questions',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="container">
      <div class="text-center">
        <button *ngIf="isEditable" mat-raised-button color="primary" [routerLink]="['/admin/add-question', examId]">Add New Question</button>
      </div>
      <div *ngIf="questions.length === 0" class="text-center">
        <p>No questions available.</p>
      </div>
      <mat-card *ngFor="let question of questions; let i = index" class="question-card">
        <mat-card-content>
          <h3>Question {{ i + 1 }}: {{ question.questionText }}</h3>
          <p>Type: {{ question.questionType }}</p>
          <p>Points: {{ question.points }}</p>
          <div *ngFor="let option of question.options">
            <p>{{ option.optionText }} {{ option.isCorrect ? '(Correct)' : '' }}</p>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button *ngIf="isEditable" mat-button color="accent" [routerLink]="['/admin/update-question', examId, question._id]">Update</button>
          <button *ngIf="isEditable" mat-icon-button color="warn" (click)="deleteQuestion(question._id)">
            <mat-icon>delete</mat-icon>
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
    <style>
      .container { padding: 20px; }
      .question-card { margin: 20px 0; }
      .text-center { text-align: center; margin-bottom: 20px; }
    </style>
  `
})
export class ViewQuestionsComponent implements OnInit {
  examId: string | null = null;
  questions: any[] = [];
  isEditable: boolean = false;

  constructor(private route: ActivatedRoute, private questionService: QuestionService) {}

  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('examId');
    this.route.queryParams.subscribe(params => {
      this.isEditable = params['isEditable'] === 'true';
      console.log('isEditable:', this.isEditable);
    });
    if (this.examId) {
      this.questionService.getQuestionsByExam(this.examId).subscribe(
        (data) => {
          this.questions = data.allQuestions || [];
          console.log('Questions:', this.questions);
        },
        (error) => {
          console.error('Error fetching questions:', error);
          Swal.fire('Error!', 'Failed to load questions.', 'error');
        }
      );
    }
  }

  deleteQuestion(questionId: string) {
    if (this.examId) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.questionService.deleteQuestion(this.examId!, questionId).subscribe(
            () => {
              this.questions = this.questions.filter(q => q._id !== questionId);
              Swal.fire('Deleted!', 'Question has been deleted.', 'success');
            },
            (error) => Swal.fire('Error!', 'Failed to delete question.', 'error')
          );
        }
      });
    }
  }
}
