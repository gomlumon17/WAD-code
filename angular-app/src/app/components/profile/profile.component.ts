import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  clearCurrentUserEmail,
  formatDate,
  getCurrentUserEmail,
  getUsers,
  type UserRecord,
} from '../../shared/user-store';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  template: `
<main class="container">
  <section class="profile-wrapper">

    <!-- Header -->
    <div class="header">
      <h2>User Profile</h2>
      <button class="logout-btn" (click)="logout()">Logout</button>
    </div>

    <!-- Current User -->
    @if (currentUser) {
      <div class="card">
        <h3>Personal Information</h3>

        <div class="grid">
          <div class="item">
            <label>Name</label>
            <p>{{ currentUser.firstName }} {{ currentUser.lastName }}</p>
          </div>

          <div class="item">
            <label>Email</label>
            <p>{{ currentUser.email }}</p>
          </div>

          <div class="item">
            <label>Phone</label>
            <p>{{ currentUser.phone }}</p>
          </div>

          <div class="item">
            <label>Gender</label>
            <p>{{ currentUser.gender }}</p>
          </div>

          <div class="item">
            <label>DOB</label>
            <p>{{ formatDate(currentUser.dob) }}</p>
          </div>

          <div class="item full">
            <label>Address</label>
            <p>{{ currentUser.address }}</p>
          </div>
        </div>
      </div>
    }

    <!-- Users Table -->
    <div class="card">
      <h3>All Registered Users</h3>

      <div class="table-container">
        @if (users.length) {
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Reg Date</th>
              </tr>
            </thead>
            <tbody>
              @for (user of users; track user.email) {
                <tr>
                  <td>{{ user.firstName }} {{ user.lastName }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.phone }}</td>
                  <td>{{ user.gender }}</td>
                  <td>{{ formatDate(user.registeredAt) }}</td>
                </tr>
              }
            </tbody>
          </table>
        } @else {
          <p class="empty-state">No users found.</p>
        }
      </div>
    </div>

  </section>
</main>
`
})
export class ProfileComponent implements OnInit {
  public users: UserRecord[] = [];
  public currentUser: UserRecord | null = null;

  public constructor(private readonly router: Router) {}

  public ngOnInit(): void {
    this.users = getUsers();

    const email = getCurrentUserEmail();
    if (!email) {
      void this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
    if (!this.currentUser) {
      clearCurrentUserEmail();
      void this.router.navigate(['/login']);
    }
  }

  public formatDate(value: string): string {
    return formatDate(value);
  }

  public logout(): void {
    clearCurrentUserEmail();
    void this.router.navigate(['/login']);
  }
}
