import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet,Router } from '@angular/router';
import { AuthService } from './services/auth.service';
// import { HttpClient } from '@angular/common/http';
// import { Home } from "./home/home";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('TechNewsApp');

    constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check session immediately
    this.authService.checkSession().subscribe({
      next: (res) => {
        if (res.loggedIn && res.user) {
          // User is already logged in → go to home
          this.authService.setUser(res.user);
          this.router.navigate(['/home']);
        }
        // Else: let them see login page
      },
      error: () => {
        // Assume not logged in
        console.error('Session check failed');
      }
    });
  }
}
