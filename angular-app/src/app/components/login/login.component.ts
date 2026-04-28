import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { findUserByEmail, getUsers, setCurrentUserEmail } from '../../shared/user-store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
<main class="container">
  <section class="form-wrapper">
    <h2>Welcome Back 👋</h2>
    <p class="subtitle">Login to continue</p>

    <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
      
      <div class="form-group">
        <label>Email</label>
        <input
          name="email"
          type="email"
          [(ngModel)]="email"
          required
          [class.invalid]="submitted && !email"
          placeholder="Enter your email"
        />
        <span class="error">{{ submitted && !email ? 'Email required' : '' }}</span>
      </div>

      <div class="form-group">
        <label>Password</label>
        <input
          name="password"
          type="password"
          [(ngModel)]="password"
          required
          [class.invalid]="submitted && !password"
          placeholder="Enter your password"
        />
        <span class="error">{{ submitted && !password ? 'Password required' : '' }}</span>
      </div>

      <span class="error main-error">{{ errorMessage }}</span>

      <button type="submit">Login</button>

      <div class="links">
        <span>New here?</span>
        <a routerLink="/register">Create Account</a>
      </div>

    </form>
  </section>
</main>
`,
})
export class LoginComponent {
  public email = '';
  public password = '';
  public submitted = false;
  public errorMessage = '';

  public constructor(private readonly router: Router) {}

  public onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (!this.email.trim() || !this.password) {
      return;
    }

    const users = getUsers();
    const user = findUserByEmail(users, this.email);

    if (!user || user.password !== this.password) {
      this.errorMessage = 'Invalid email or password';
      return;
    }

    setCurrentUserEmail(user.email);
    void this.router.navigate(['/profile']);
  }
}
