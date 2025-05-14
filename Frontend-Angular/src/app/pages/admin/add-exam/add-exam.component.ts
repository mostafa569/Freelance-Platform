import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ExamService } from '../../../services/exam.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-exam',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Add New Exam</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="examForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" placeholder="Enter exam title">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" placeholder="Enter exam description" rows="5"></textarea>
            </mat-form-field>
            <div class="text-center">
              <button mat-raised-button color="primary" type="submit">Add Exam</button>
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
export class AddExamComponent {
  examForm;

  constructor(private fb: FormBuilder, private examService: ExamService, private router: Router) {
    this.examForm = this.fb.group({
      title: [''],
      description: [''],
      created_by: ['']
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.examForm.patchValue({ created_by: user._id });
  }

  onSubmit() {
    if (!this.examForm.value.title) {
      Swal.fire('Error', 'Title is required', 'error');
      return;
    }
    this.examService.addExam(this.examForm.value).subscribe(
      () => {
        Swal.fire('Success', 'Exam added successfully', 'success');
        this.router.navigate(['admin/exams']);
      },
      (error) => Swal.fire('Error', 'Failed to add exam', 'error')
    );
  }
}

