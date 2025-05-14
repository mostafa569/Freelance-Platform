import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, RouterModule],
  template: `
    <mat-toolbar color="primary">
      <span>Exam Portal</span>
      <span class="spacer"></span>
      <button mat-button [routerLink]="['/']">Home</button>
      <button mat-button *ngIf="authService.isLoggedIn" [routerLink]="['/profile']">Profile</button>
      <button mat-button *ngIf="authService.isLoggedIn" (click)="logout()">Logout</button>
      <button mat-button *ngIf="!authService.isLoggedIn" [routerLink]="['/login']">Login</button>
      <button mat-button *ngIf="!authService.isLoggedIn" [routerLink]="['/signup']">Signup</button>
    </mat-toolbar>
    <style>
      .spacer { flex: 1 1 auto; }
    </style>
  `
})
export class NavbarComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
