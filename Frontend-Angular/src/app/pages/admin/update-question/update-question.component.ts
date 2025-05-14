import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { QuestionService } from '../../../services/question.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-question',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatCheckboxModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Update Question</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="questionForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Question Text</mat-label>
              <textarea matInput formControlName="questionText" placeholder="Enter question text" rows="3"></textarea>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Question Type</mat-label>
              <mat-select formControlName="questionType">
                <mat-option value="multiple_choice">Multiple Choice</mat-option>
                <mat-option value="true_false">True/False</mat-option>
                <mat-option value="short_answer">Short Answer</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Points</mat-label>
              <input matInput type="number" formControlName="points" placeholder="Enter points">
            </mat-form-field>
            <div formArrayName="options" *ngIf="questionForm.value.questionType === 'multiple_choice'">
              <div *ngFor="let option of options.controls; let i=index" [formGroupName]="i">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Option {{ i + 1 }}</mat-label>
                  <input matInput formControlName="optionText" placeholder="Enter option">
                </mat-form-field>
                <mat-checkbox formControlName="isCorrect">Correct</mat-checkbox>
              </div>
              <button mat-button color="accent" (click)="addOption()">Add Option</button>
            </div>
            <div class="text-center">
              <button mat-raised-button color="primary" type="submit">Update Question</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
    <style>
      .container { display: flex; justify-content: center; padding: 20px; }
      mat-card { width: 500px; }
      .full-width { width: 100%; }
      .text-center { text-align: center; margin-top: 20px; }
    </style>
  `
})
export class UpdateQuestionComponent implements OnInit {
  examId: string | null = null;
  questionId: string | null = null;
  questionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.questionForm = this.fb.group({
      questionText: [''],
      questionType: ['multiple_choice'],
      points: [1],
      options: this.fb.array([])
    });
  }

  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('examId');
    this.questionId = this.route.snapshot.paramMap.get('questionId');
    if (this.examId && this.questionId) {
      this.questionService.getQuestionsByExam(this.examId).subscribe(
        (data: any) => {
          const question = data.allQuestions.find((q: any) => q._id === this.questionId);
          if (question) {
            this.questionForm.patchValue({
              questionText: question.questionText,
              questionType: question.questionType,
              points: question.points
            });

            // Clear existing options
            while (this.options.length) {
              this.options.removeAt(0);
            }

            // Add options if multiple_choice
            if (question.questionType === 'multiple_choice' && question.options) {
              question.options.forEach((opt: any) => {
                this.options.push(this.fb.group({
                  optionText: [opt.optionText || ''],
                  isCorrect: [opt.isCorrect || false]
                }));
              });
            }
          } else {
            Swal.fire('Error', 'Question not found', 'error');
          }
        },
        (error) => {
          console.error('Error fetching questions:', error);
          Swal.fire('Error', 'Failed to load questions', 'error');
        }
      );
    } else {
      Swal.fire('Error', 'Invalid exam or question ID', 'error');
    }
  }

  get options() {
    return this.questionForm.get('options') as FormArray;
  }

  addOption() {
    this.options.push(this.fb.group({
      optionText: [''],
      isCorrect: [false]
    }));
  }

  onSubmit() {
    if (!this.examId || !this.questionId || !this.questionForm.value.questionText) {
      Swal.fire('Error', 'Question text is required', 'error');
      return;
    }
    const questionData = { ...this.questionForm.value, examId: this.examId };
    this.questionService.updateQuestion(this.examId, this.questionId, questionData).subscribe(
      () => {
        Swal.fire('Success', 'Question updated successfully', 'success');
        this.router.navigate(['admin/questions', this.examId]);
      },
      (error) => {
        console.error('Error updating question:', error);
        Swal.fire('Error', 'Failed to update question', 'error');
      }
    );
  }
}
