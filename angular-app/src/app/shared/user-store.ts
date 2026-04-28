export interface UserRecord {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  address: string;
  password: string;
  registeredAt: string;
}

const USERS_STORAGE_KEY = 'angular-app.users';
const CURRENT_USER_EMAIL_KEY = 'angular-app.currentUserEmail';

export function getUsers(): UserRecord[] {
  const raw = localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as UserRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUsers(users: UserRecord[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function setCurrentUserEmail(email: string): void {
  localStorage.setItem(CURRENT_USER_EMAIL_KEY, email.toLowerCase());
}

export function clearCurrentUserEmail(): void {
  localStorage.removeItem(CURRENT_USER_EMAIL_KEY);
}

export function getCurrentUserEmail(): string | null {
  return localStorage.getItem(CURRENT_USER_EMAIL_KEY);
}

export function findUserByEmail(users: UserRecord[], email: string): UserRecord | undefined {
  const normalizedEmail = email.trim().toLowerCase();
  return users.find((user) => user.email.toLowerCase() === normalizedEmail);
}

export function formatDate(isoDate: string): string {
  if (!isoDate) {
    return '-';
  }

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
