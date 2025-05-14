import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { UserDashboardComponent } from './pages/user/user-dashboard/user-dashboard.component';
import { StartQuizComponent } from './pages/user/start-quiz/start-quiz.component';
import { ViewResultsComponent } from './pages/user/view-results/view-results.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminGuard } from './services/admin.guard';
import { ViewExamsComponent } from './pages/admin/view-exams/view-exams.component';
import { AddExamComponent } from './pages/admin/add-exam/add-exam.component';
import { UpdateExamComponent } from './pages/admin/update-exam/update-exam.component';
import { ViewQuestionsComponent } from './pages/admin/view-questions/view-questions.component';
import { AddQuestionComponent } from './pages/admin/add-question/add-question.component';
import { UpdateQuestionComponent } from './pages/admin/update-question/update-question.component';
import { ViewStudentsResultsComponent } from './pages/admin/view-students-results/view-students-results.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: 'welcome', loadComponent: () => import('./pages/admin/welcome/welcome.component').then(m => m.WelcomeComponent) },
      { path: 'profile', component: ProfileComponent },
      { path: 'exams', component: ViewExamsComponent },
      { path: 'add-exam', component: AddExamComponent },
      { path: 'update-exam/:id', component: UpdateExamComponent },
      { path: 'questions/:examId', component: ViewQuestionsComponent },
      { path: 'add-question/:examId', component: AddQuestionComponent },
      { path: 'update-question/:examId/:questionId', component: UpdateQuestionComponent },
      { path: 'students-results', component: ViewStudentsResultsComponent }
    ]
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    children: [
      { path: 'exams', component: ViewExamsComponent },
      { path: ':examId', component: StartQuizComponent },
      { path: 'results/:attemptId', component: ViewResultsComponent }
    ]
  },
  { path: 'profile', component: ProfileComponent }
];
