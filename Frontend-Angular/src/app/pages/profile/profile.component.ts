import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Your Profile</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table class="profile-table">
            <tr>
              <td>Username</td>
              <td>{{ user?.username }}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{{ user?.email }}</td>
            </tr>
            <tr>
              <td>Role</td>
              <td>{{ user?.role }}</td>
            </tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
    <style>
      .container { padding: 20px; display: flex; justify-content: center; }
      mat-card { width: 500px; }
      .profile-table { width: 100%; border-collapse: collapse; }
      .profile-table td { padding: 10px; border: 1px solid #ddd; }
    </style>
  `
})
export class ProfileComponent {
  user: any;

  constructor(private authService: AuthService) {
    this.user = this.authService.getUserDetails();
  }
}
