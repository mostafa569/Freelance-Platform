import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Welcome to Exam Portal</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Login or register to start taking or managing exams.</p>
        </mat-card-content>
        <mat-card-actions class="text-center">
          <button mat-raised-button *ngIf="!authService.isLoggedIn" color="primary" [routerLink]="['/login']">Login</button>
          <button mat-raised-button *ngIf="!authService.isLoggedIn" color="accent" [routerLink]="['/signup']">Register</button>
          <button mat-raised-button *ngIf="authService.isLoggedIn" color="primary" [routerLink]="['/profile']">Profile</button>
          <button mat-raised-button *ngIf="authService.isLoggedIn" color="primary" [routerLink]="['/admin/welcome']">Dashboard</button>
          <button mat-raised-button *ngIf="authService.isLoggedIn" color="warn" (click)="logout()">Logout</button>
        </mat-card-actions>
      </mat-card>
    </div>
    <style>
      .container { padding: 20px; display: flex; justify-content: center; }
      mat-card { width: 500px; }
      .text-center { text-align: center; }
    </style>
  `
})
export class HomeComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
