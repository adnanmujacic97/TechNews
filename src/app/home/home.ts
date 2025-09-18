import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../services/user.model';
import { NgIf,CommonModule } from '@angular/common';


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

  constructor(private userService: UserService) {
    console.log('Got the data');
  }

  ngOnInit(): void {
    this.userService.getUserByUsername('Adnan97').subscribe({
      next: (data) => {
        this.user = data;
        console.log('Got the data');
      },
      error: (err) => {
        console.error('Failed to load user:', err);
        this.error = err.error?.message || 'Could not load user.';
      }
    });
  }
}