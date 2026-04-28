import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  findUserByEmail,
  getUsers,
  saveUsers,
  setCurrentUserEmail,
  type UserRecord,
} from '../../shared/user-store';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
<main class="container">
  <section class="form-wrapper">

    <h2>Create Account 🚀</h2>
    <p class="subtitle">Join the platform</p>

    <form (ngSubmit)="onSubmit()">

      <!-- Row 1 -->
      <div class="form-row">
        <div class="form-group">
          <label>First Name</label>
          <input [(ngModel)]="firstName" name="firstName" required placeholder="First name"
          [class.invalid]="submitted && !firstName.trim()" />
        </div>

        <div class="form-group">
          <label>Last Name</label>
          <input [(ngModel)]="lastName" name="lastName" required placeholder="Last name"
          [class.invalid]="submitted && !lastName.trim()" />
        </div>

        <div class="form-group">
          <label>Gender</label>
          <select [(ngModel)]="gender" name="gender">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <!-- Row 2 -->
      <div class="form-row">
        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" name="email" placeholder="Enter email"
          [class.invalid]="submitted && !email.trim()" />
        </div>

        <div class="form-group">
          <label>Phone</label>
          <input [(ngModel)]="phone" name="phone" placeholder="Phone number"
          [class.invalid]="submitted && !phone.trim()" />
        </div>

        <div class="form-group">
          <label>DOB</label>
          <input type="date" [(ngModel)]="dob" name="dob"
          [class.invalid]="submitted && !dob" />
        </div>
      </div>

      <!-- Row 3 -->
      <div class="form-row">
        <div class="form-group">
          <label>Password</label>
          <input type="password" [(ngModel)]="password" name="password"
          [class.invalid]="submitted && !password" />
        </div>

        <div class="form-group">
          <label>Confirm Password</label>
          <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword"
          [class.invalid]="submitted && (password !== confirmPassword)" />
        </div>
      </div>

      <!-- Address -->
      <div class="form-group">
        <label>Address</label>
        <textarea rows="2" [(ngModel)]="address" name="address"
        [class.invalid]="submitted && !address.trim()"></textarea>
      </div>

      <span class="error main-error">{{ errorMessage }}</span>

      <button type="submit">Register</button>

      <div class="links">
        <span>Already have an account?</span>
        <a routerLink="/login">Login</a>
      </div>

    </form>
  </section>
</main>
`,
})
export class RegisterComponent {
  public firstName = '';
  public lastName = '';
  public email = '';
  public phone = '';
  public gender = 'Male';
  public dob = '';
  public address = '';
  public password = '';
  public confirmPassword = '';

  public submitted = false;
  public errorMessage = '';

  public constructor(private readonly router: Router) {}

  public onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (
      !this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.email.trim() ||
      !this.phone.trim() ||
      !this.dob ||
      !this.address.trim() ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    const users = getUsers();
    if (findUserByEmail(users, this.email)) {
      this.errorMessage = 'User with this email already exists';
      return;
    }

    const user: UserRecord = {
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim().toLowerCase(),
      phone: this.phone.trim(),
      gender: this.gender,
      dob: this.dob,
      address: this.address.trim(),
      password: this.password,
      registeredAt: new Date().toISOString(),
    };

    users.push(user);
    saveUsers(users);
    setCurrentUserEmail(user.email);
    void this.router.navigate(['/profile']);
  }
}
