import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, NavigationEnd, RouterOutlet,Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';
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
  //   // Check session immediately
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
    // this.router.events
    //   .pipe(filter(event => event instanceof NavigationEnd))
    //   .subscribe(() => {
    //     this.authService.checkSession().subscribe({
    //       next: (res) => {
    //         if (res.loggedIn) {
    //           // Sync user if changed (e.g., role updated)
    //           this.authService.setUser(res.user);
    //         } else {
    //           // Not logged in → go to login
    //           if (!this.router.url.includes('login')) {
    //             this.router.navigate(['']);
    //           }
    //         }
    //       },
    //       error: () => {
    //         // Network error? Assume not logged in
    //         this.router.navigate(['']);
    //       }
    //     });
    //   });
  }
}

