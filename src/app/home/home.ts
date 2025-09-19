import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../services/user.model';
import { NgIf,CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class Home implements OnInit {
  user: User | null = null;
  loading = true;
  error = '';
  userName = '';
  

  constructor(private userService: UserService, private authService : AuthService, private router : Router) {
  }

  ngOnInit(): void {
        this.authService.checkSession().subscribe({
      next: (res) => {
        if (res.loggedIn && res.user) {
          // User is already logged in → go to home
          console.log(res.user.Username)
         this.authService.setUser(res.user);
          
        }
        // Else: let them see login page
      },
      error: () => {
        // Assume not logged in
        console.error('Session check failed');
      }
    });
    // this.userName = this.authService.user$.subscribe();
    // console.log(this.userName);

    this.userService.getUserByUsername(this.authService.user?.Username ?? "").subscribe({
      next: (data) => {
        this.user = data;
        console.log("Loaded user");
      },
      error: (err) => {
        console.error('Failed to load user:', err);
        this.error = err.error?.message || 'Could not load user.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }

}
