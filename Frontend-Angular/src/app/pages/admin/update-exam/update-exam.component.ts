import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ExamService } from '../../../services/exam.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-exam',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Update Exam</mat-card-title>
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
              <button mat-raised-button color="primary" type="submit">Update Exam</button>
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
export class UpdateExamComponent implements OnInit {
  examForm: FormGroup;
  examId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.examForm = this.fb.group({
      title: [''],
      description: [''],
      created_by: ['']
    });
  }

  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('id');

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.examForm.patchValue({ created_by: user._id });

    if (this.examId) {
      this.examService.getExamById(this.examId).subscribe(
        (response: any) => {
          const data = response.data;
          if (data) {
            this.examForm.patchValue({
              title: data.title,
              description: data.description,
              created_by: data.created_by?._id || data.created_by
            });
          } else {
            Swal.fire('Error', 'Exam not found', 'error');
          }
        },
        (error) => {
          console.error('Error fetching exam:', error);
          Swal.fire('Error', 'Failed to load exam data: ' + (error.error?.message || 'Unknown error'), 'error');
        }
      );
    } else {
      Swal.fire('Error', 'Invalid exam ID', 'error');
    }
  }

  onSubmit() {
    if (!this.examForm.value.title) {
      Swal.fire('Error', 'Title is required', 'error');
      return;
    }
    if (this.examId) {
      this.examService.updateExam(this.examId, this.examForm.value).subscribe(
        () => {
          Swal.fire('Success', 'Exam updated successfully', 'success');
          this.router.navigate(['admin/exams']);
        },
        (error) => {
          console.error('Error updating exam:', error);
          Swal.fire('Error', 'Failed to update exam: ' + (error.error?.message || 'Unknown error'), 'error');
        }
      );
    }
  }
}
