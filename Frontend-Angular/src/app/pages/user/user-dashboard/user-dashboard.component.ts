import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatListModule, MatIconModule, RouterModule],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened class="sidenav">
        <mat-nav-list>
          <a mat-list-item [routerLink]="['/user-dashboard/exams']">
            <mat-icon matListIcon>list</mat-icon> Exams
          </a>
          <a mat-list-item [routerLink]="['/profile']">
            <mat-icon matListIcon>person</mat-icon> Profile
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
    <style>
      .sidenav-container { height: 100vh; }
      .sidenav { width: 200px; }
    </style>
  `
})
export class UserDashboardComponent {}
