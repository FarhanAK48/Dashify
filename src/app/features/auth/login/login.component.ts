import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  error   = signal('');
  loading = signal(false);

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  fillAdmin(): void { this.form.patchValue({ email: 'admin@demo.com', password: 'admin123' }); }
  fillUser():  void { this.form.patchValue({ email: 'user@demo.com',  password: 'user1234' }); }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');
    setTimeout(() => {
      const result = this.auth.login(this.form.value as any);
      if (result.success) this.router.navigate(['/dashboard']);
      else this.error.set(result.message);
      this.loading.set(false);
    }, 500);
  }
}
