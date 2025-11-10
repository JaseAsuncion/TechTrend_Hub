import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id?: number;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = `${environment.apiUrl}/auth`;
  
  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = signal<boolean>(false);

  constructor() {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
      this.isAuthenticated.set(true);
    }
  }

  // Sign up a new user
  signup(userData: User): Observable<AuthResponse> {
    // For now, save to localStorage. Connect to backend later
    const user: User = {
      ...userData,
      id: Date.now() // Generate temporary ID
    };
    
    // Save to localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set current user
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return of({ user, token: 'mock_token_' + user.id });
    
    // When backend is ready, uncomment this:
    // return this.http.post<AuthResponse>(`${this.apiBase}/signup`, userData);
  }

  // Login existing user
  login(email: string, password: string): Observable<AuthResponse> {
    // For now, check localStorage. Connect to backend later
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Set current user
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return of({ user, token: 'mock_token_' + user.id });
    
    // When backend is ready, uncomment this:
    // return this.http.post<AuthResponse>(`${this.apiBase}/login`, { email, password });
  }

  // Logout current user
  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('currentUser');
  }

  // Get current user ID for orders
  getCurrentUserId(): number | null {
    const user = this.currentUser();
    return user?.id || null;
  }
}











