import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUser, LoginCredentials, UserRole } from '../../models/user.model';

const MOCK_USERS: AuthUser[] = [
  { id: 1, name: 'Admin User',  email: 'admin@demo.com', role: 'admin', token: 'jwt-admin-token-xyz' },
  { id: 2, name: 'John User',   email: 'user@demo.com',  role: 'user',  token: 'jwt-user-token-abc'  },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private _user  = signal<AuthUser | null>(this.loadFromStorage());

  currentUser = computed(() => this._user());
  isLoggedIn  = computed(() => this._user() !== null);
  isAdmin     = computed(() => this._user()?.role === 'admin');

  login(creds: LoginCredentials): { success: boolean; message: string } {
    const found = MOCK_USERS.find(u => u.email === creds.email);
    if (!found)                   return { success: false, message: 'Email not found.' };
    if (creds.password.length < 4) return { success: false, message: 'Password too short.' };
    this._user.set(found);
    localStorage.setItem('ap_user', JSON.stringify(found));
    return { success: true, message: 'OK' };
  }

  logout(): void {
    this._user.set(null);
    localStorage.removeItem('ap_user');
    this.router.navigate(['/auth/login']);
  }

  hasRole(role: UserRole): boolean { return this._user()?.role === role; }

  private loadFromStorage(): AuthUser | null {
    try { const s = localStorage.getItem('ap_user'); return s ? JSON.parse(s) : null; }
    catch { return null; }
  }
}
