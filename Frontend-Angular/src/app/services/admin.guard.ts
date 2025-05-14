import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isUserLoggedIn() && this.authService.getUserRole() === 'teacher') {
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
}