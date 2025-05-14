import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-results',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Your Exam Result</mat-card-title>
        </mat-card-header>
        <mat-card-content *ngIf="result">
  <p><strong>Total Score:</strong> {{ result.totalScore }}</p>

  <div *ngFor="let answer of result.answers">
    <p><strong>Question:</strong> {{ answer.question }}</p>
    <p><strong>Your Answer:</strong> {{ answer.selectedOption }}</p>
    <p><strong>Score:</strong> {{ answer.score }}</p>
    <hr />
  </div>
</mat-card-content>

      </mat-card>
    </div>
    <style>
      .container { padding: 20px; display: flex; justify-content: center; }
      mat-card { width: 500px; }
    </style>
  `
})
export class ViewResultsComponent implements OnInit {
  attemptId: string | null = null;
  result: any = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.attemptId = this.route.snapshot.paramMap.get('attemptId');
    if (this.attemptId) {
      this.http.get(`http://localhost:9100/exams/student/results/${this.attemptId}`).subscribe(
        (data: any) => {
          this.result = data.result; // 👈 كدا هتوصل للـ exam والـ totalScore والـ answers
        },
        (error) => console.error(error)
      );
    }
  }
}
