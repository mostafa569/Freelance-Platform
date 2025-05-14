import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../../services/question.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Add New Question</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="questionForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Question Text</mat-label>
              <input matInput formControlName="questionText" placeholder="Enter question text">
              <mat-error *ngIf="questionForm.get('questionText')?.hasError('required')">Question text is required</mat-error>
              <mat-error *ngIf="questionForm.get('questionText')?.hasError('minlength')">Question text must be at least 5 characters</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Question Type</mat-label>
              <mat-select formControlName="questionType">
                <mat-option value="multiple_choice">Multiple Choice</mat-option>
                <mat-option value="true_false">True/False</mat-option>
              </mat-select>
              <mat-error *ngIf="questionForm.get('questionType')?.hasError('required')">Question type is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Points</mat-label>
              <input matInput type="number" formControlName="points" placeholder="Enter points">
              <mat-error *ngIf="questionForm.get('points')?.hasError('required')">Points are required</mat-error>
              <mat-error *ngIf="questionForm.get('points')?.hasError('min')">Points must be at least 1</mat-error>
            </mat-form-field>

            <div formArrayName="options" *ngIf="questionForm.get('questionType')?.value !== 'short_answer'">
              <h4>Options</h4>
              <div *ngFor="let option of options.controls; let i = index" [formGroupName]="i" class="option">
                <mat-form-field appearance="outline" class="option-text">
                  <mat-label>Option {{ i + 1 }}</mat-label>
                  <input matInput formControlName="optionText" placeholder="Enter option text">
                  <mat-error *ngIf="options.controls[i].get('optionText')?.hasError('required')">Option text is required</mat-error>
                </mat-form-field>
                <mat-checkbox formControlName="isCorrect">Correct</mat-checkbox>
                <button mat-icon-button color="warn" (click)="removeOption(i)">X</button>
              </div>
              <button mat-button color="primary" type="button" (click)="addOption()">Add Option</button>
            </div>

            <div class="text-center">
              <button mat-raised-button color="primary" type="submit" [disabled]="questionForm.invalid">Add Question</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
    <style>
      .container { padding: 20px; }
      .full-width { width: 100%; }
      .option { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
      .option-text { flex: 1; }
      .text-center { text-align: center; margin-top: 20px; }
    </style>
  `
})
export class AddQuestionComponent implements OnInit {
  questionForm: FormGroup;
  examId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private router: Router
  ) {
    this.questionForm = this.fb.group({
      questionText: ['', [Validators.required, Validators.minLength(5)]],
      questionType: ['', Validators.required],
      points: ['', [Validators.required, Validators.min(1)]],
      options: this.fb.array([])
    });
  }

  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('examId');
    this.questionForm.get('questionType')?.valueChanges.subscribe(value => {
      this.options.clear();
      if (value === 'true_false') {
        this.setTrueFalseOptions();
      } else if (value === 'multiple_choice') {
        this.addOption();
        this.addOption();
      }
    });
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  addOption() {
    const optionGroup = this.fb.group({
      optionText: ['', Validators.required],
      isCorrect: [false]
    });
    this.options.push(optionGroup);
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  setTrueFalseOptions() {
    this.options.clear();
    this.options.push(this.fb.group({
      optionText: ['True', Validators.required],
      isCorrect: [false]
    }));
    this.options.push(this.fb.group({
      optionText: ['False', Validators.required],
      isCorrect: [false]
    }));
  }

  onSubmit() {
    if (this.questionForm.valid && this.examId) {
      const questionData = {
        examId: this.examId,
        questionText: this.questionForm.value.questionText,
        questionType: this.questionForm.value.questionType,
        points: this.questionForm.value.points
      };

      this.questionService.addQuestion(this.examId, questionData).subscribe(
        (response: any) => {
          const questionId = response.question._id;
          const options = this.questionForm.value.options;

          if (options.length > 0 && questionData.questionType !== 'short_answer') {
            const optionRequests = options.map((option: any) =>
              this.questionService.addQuestionOption(questionId, {
                questionId: questionId,
                optionText: option.optionText,
                isCorrect: option.isCorrect
              })
            );

            forkJoin(optionRequests).subscribe(
              () => {
                Swal.fire('Success!', 'Question and options added successfully.', 'success');
                this.router.navigate(['/admin/questions', this.examId]);
              },
              (error) => {
                console.error('Error adding options:', error);
                Swal.fire('Error!', 'Failed to add options.', 'error');
              }
            );
          } else {
            Swal.fire('Success!', 'Question added successfully.', 'success');
            this.router.navigate(['/admin/questions', this.examId]);
          }
        },
        (error) => {
          console.error('Error adding question:', error);
          Swal.fire('Error!', 'Failed to add question: ' + (error.error?.message || 'Unknown error'), 'error');
        }
      );
    } else {
      Swal.fire('Error!', 'Please fill all required fields correctly.', 'error');
    }
  }
}
