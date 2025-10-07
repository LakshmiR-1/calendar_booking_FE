import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  private preferencesSubject = new BehaviorSubject<string[]>([]);
  public preferences$: Observable<string[]> = this.preferencesSubject.asObservable();

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
    
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      this.preferencesSubject.next(JSON.parse(savedPrefs));
    }
  }

  setCurrentUser(user: User | null) {
    this.currentUserSubject.next(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  setPreferences(preferences: string[]) {
    this.preferencesSubject.next(preferences);
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }

  getPreferences(): string[] {
    return this.preferencesSubject.value;
  }
}
