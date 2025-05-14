import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { ResultService } from '../../../services/result.service';

@Component({
  selector: 'app-view-students-results',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Students' Results</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="results" class="mat-elevation-z8">
            <ng-container matColumnDef="student">
              <th mat-header-cell *matHeaderCellDef>Student</th>
              <td mat-cell *matCellDef="let result">{{ result.student?.username || result.student?._id }}</td>
            </ng-container>
            <ng-container matColumnDef="exam">
              <th mat-header-cell *matHeaderCellDef>Exam</th>
              <td mat-cell *matCellDef="let result">{{ result.examTitle }}</td>
            </ng-container>
            <ng-container matColumnDef="totalScore">
              <th mat-header-cell *matHeaderCellDef>Total Score</th>
              <td mat-cell *matCellDef="let result">{{ result.totalScore }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          <div *ngIf="results.length === 0" class="text-center">
            <p>No results available.</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
    <style>
      .container { padding: 20px; }
      table { width: 100%; }
      .text-center { text-align: center; margin-top: 20px; }
    </style>
  `
})
export class ViewStudentsResultsComponent implements OnInit {
  results: any[] = [];
  displayedColumns: string[] = ['student', 'exam', 'totalScore'];

  constructor(private resultService: ResultService) {}

  ngOnInit() {
    this.resultService.getResults().subscribe(
      (data) => {
        console.log('API Response:', data);
        this.results = data.results || [];
        console.log('Results data:', this.results);
      },
      (error) => {
        console.error('Request Error:', error);
        console.log('Request Headers:', error.url, error.headers);
        alert('Failed to load results. Check console for details.');
      }
    );
  }
}
