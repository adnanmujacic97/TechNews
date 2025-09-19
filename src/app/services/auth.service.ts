// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from './user.model';


@Injectable({
  providedIn: 'root' // ← Automatically provided in root injector
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable(); // Reactive stream

  public get user(): User | null {
    return this.userSubject.value;
  }

  constructor(private http: HttpClient) {
    // On startup, check if user is already logged in
    this.checkSession().subscribe({
      next: (res) => {
        if (res.loggedIn && res.user) {
          this.userSubject.next(res.user);
        } else {
          this.userSubject.next(null);
        }
      },
      error: () => {
        this.userSubject.next(null);
      }
    });
  }

  // Login method
  login(username: string, password: string): Observable<{ success: boolean; message?: string; user?: User }> {
    return this.http.post<{ success: boolean; message?: string; user?: User }>(
      'http://localhost/api/login.php',
      { username, password },
      { withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
       } 
    );
  }

  // Check current session
  checkSession(): Observable<{ loggedIn: boolean; user: User | null }> {
    return this.http.get<{ loggedIn: boolean; user: User | null }>(
      'http://localhost/api/check-session.php',
      { withCredentials: true }
    );
  }

  // Logout
  logout(): Observable<any> {
    return this.http.post('http://localhost/api/logout.php', {}, { withCredentials: true });
  }

  // Set user after login
  setUser(user: User | null) {
    this.userSubject.next(user);
  }

  // Helper: Is user admin?
  isAdmin(): boolean {
    return this.user?.Role === 'Admin';
  }

  // Helper: Is logged in?
  isLoggedIn(): boolean {
    return !!this.user;
  }
}