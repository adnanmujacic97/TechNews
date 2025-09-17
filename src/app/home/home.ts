import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../services/user';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class Home implements OnInit {
  user: User | null = null;
  loading = true;
  error = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: (response) => {
        if (response.success) {
          this.user = response.data!;
        } else {
          this.error = response.message || 'User not found.';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to connect to server.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}