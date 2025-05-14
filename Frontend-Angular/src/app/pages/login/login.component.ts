import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Login to Your Account</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="Enter email">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" placeholder="Enter password">
            </mat-form-field>
            <div class="text-center">
              <button mat-raised-button color="primary" type="submit">Login</button>
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
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private snack: MatSnackBar, private router: Router) {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  onSubmit() {
    if (!this.loginForm.value.email || !this.loginForm.value.password) {
      this.snack.open('Email and password are required', '', { duration: 3000 });
      return;
    }
    this.authService.login(this.loginForm.value).subscribe(
      (data: any) => {
        this.authService.loginUser(data.token);
        this.authService.setUserDetails(data.user);
        if (this.authService.getUserRole() === 'teacher') {
          this.router.navigate(['admin']);
        } else {
          this.router.navigate(['user-dashboard']);
        }
      },
      (error) => this.snack.open('Login failed', '', { duration: 3000 })
    );
  }
}
