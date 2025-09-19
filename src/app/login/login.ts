import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { User } from '../services/user.model';

interface LoginResponse {
  success: boolean;
  message?: string;
  user?: User | null;
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login implements OnInit {
  loginForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onLogin(event?: Event) {
  if (event) {
    event.preventDefault();  // stop browser’s default POST
    event.stopPropagation(); // stop bubbling
  }
  if (this.loginForm.invalid) {
    this.errorMessage = 'Please fill all fields.';
    return;
  }

  this.loading = true;
  this.errorMessage = '';
  this.successMessage = '';

  const { username, password } = this.loginForm.value;

  this.authService.login(username, password).subscribe({
    next: (res: LoginResponse) => {
      this.loading = false;

      if (res.success && res.user) {
        // Sync frontend with backend session
        this.authService.setUser(res.user);
        console.log(res.user.Ime + res.user.Prezime);

        this.successMessage = res.message || 'Login successful!';
        
        // Redirect after brief feedback
        setTimeout(() => {
          this.router.navigate(['/home']);
          console.log("Reroute to home");
        }, 1000);
      } else {
        this.errorMessage = res.message || 'Invalid credentials.';
      }
    },
    error: () => {
      this.loading = false;
      this.errorMessage = 'Server error. Please try again later.';
    }
  });
}
}