import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Register</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" placeholder="Enter username">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="Enter email">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" placeholder="Enter password">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Role</mat-label>
              <mat-select formControlName="role">
                <mat-option value="student">Student</mat-option>
                <mat-option value="teacher">Teacher</mat-option>
              </mat-select>
            </mat-form-field>
            <div class="text-center">
              <button mat-raised-button color="primary" type="submit">Register</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
    <style>
      .container { display: flex; justify-content: center; padding: 20px; }
      mat-card { width: 400px; }
      .full-width { width: 100%; }
      .text-center { text-align: center; margin-top: 20px; }
    </style>
  `
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private snack: MatSnackBar) {
    this.signupForm = this.fb.group({
      username: [''],
      email: [''],
      password: [''],
      role: ['student']
    });
  }

  onSubmit() {
    if (!this.signupForm.value.username || !this.signupForm.value.email || !this.signupForm.value.password) {
      this.snack.open('All fields are required', '', { duration: 3000 });
      return;
    }
    this.authService.register(this.signupForm.value).subscribe(
      (data) => {
        Swal.fire('Success', 'Registration successful', 'success');
      },
      (error) => this.snack.open('Registration failed', '', { duration: 3000 })
    );
  }
}
