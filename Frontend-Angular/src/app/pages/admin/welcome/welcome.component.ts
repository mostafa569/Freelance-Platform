import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Welcome to Admin Panel</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Manage exams, questions, and view students' results from the sidebar.</p>
        </mat-card-content>
      </mat-card>
    </div>
    <style>
      .container { padding: 20px; display: flex; justify-content: center; }
      mat-card { width: 500px; }
    </style>
  `
})
export class WelcomeComponent {}