import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:9100';
  isLoggedIn = false;
  userDetails: any;

  constructor(private http: HttpClient) {
    this.checkLoginStatus();
  }

  register(user: any): Observable<any> {
    console.log('Register Request Data:', user);
    return this.http.post(`${this.baseUrl}/auth/register`, user);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    console.log('Login Request Data:', credentials);
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  loginUser(token: string) {
    localStorage.setItem('token', token);
    this.isLoggedIn = true;
    this.loadUserDetails();
    return true;
  }

  isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.userDetails = null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setUserDetails(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userDetails = user;
  }

  getUserDetails(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getUserRole(): string {
    const user = this.getUserDetails();
    return user?.role || '';
  }

  private checkLoginStatus() {
    const token = this.getToken();
    if (token) {
      this.isLoggedIn = true;
      this.loadUserDetails();
    }
  }

  private loadUserDetails() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.userDetails = JSON.parse(userStr);
    }
  }
}
