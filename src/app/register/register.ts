import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface RegisterResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})

export class Register implements OnInit {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      ime: ['', Validators.required],
      prezime: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  get passwordMismatch() {
    return this.registerForm.errors?.['mismatch'] && this.registerForm.get('confirmPassword')?.touched;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fix errors before submitting.';
      return;
    }

    const formData = this.registerForm.value;
    delete formData.confirmPassword; // Don't send to backend

    this.http.post<RegisterResponse>('http://localhost/api/register.php', formData, { withCredentials: true })
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.successMessage = res.message;
            this.errorMessage = '';
            this.registerForm.reset();
          } else {
            this.errorMessage = res.message;
            this.successMessage = '';
          }
        },
        error: () => {
          this.errorMessage = 'Server error. Please try again later.';
        }
      });
  }
}