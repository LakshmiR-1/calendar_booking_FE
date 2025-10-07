import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  is_admin: boolean;
}

export interface UserPreference {
  id: number;
  user_id: number;
  category: string;
}

export interface Booking {
  id: number;
  user_id: number;
  username: string;
  booked_at: string;
}

export interface TimeSlot {
  id: number;
  category: string;
  start_time: string;
  end_time: string;
  title: string;
  description?: string;
  booking?: Booking;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000/api'
    : `${window.location.protocol}//${window.location.hostname}:8000/api`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  createUser(username: string, isAdmin: boolean = false): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, { username, is_admin: isAdmin });
  }

  getUser(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`);
  }

  getUserPreferences(userId: number): Observable<UserPreference[]> {
    return this.http.get<UserPreference[]>(`${this.apiUrl}/users/${userId}/preferences`);
  }

  addUserPreference(userId: number, category: string): Observable<UserPreference> {
    return this.http.post<UserPreference>(`${this.apiUrl}/users/${userId}/preferences`, { category });
  }

  deleteUserPreference(userId: number, category: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}/preferences/${category}`);
  }

  getTimeSlots(startDate?: string, endDate?: string, category?: string): Observable<TimeSlot[]> {
    let url = `${this.apiUrl}/timeslots?`;
    if (startDate) url += `start_date=${startDate}&`;
    if (endDate) url += `end_date=${endDate}&`;
    if (category) url += `category=${category}&`;
    return this.http.get<TimeSlot[]>(url);
  }

  createTimeSlot(slot: Partial<TimeSlot>): Observable<TimeSlot> {
    return this.http.post<TimeSlot>(`${this.apiUrl}/timeslots`, slot);
  }

  deleteTimeSlot(slotId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/timeslots/${slotId}`);
  }

  createBooking(userId: number, timeSlotId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings`, { user_id: userId, time_slot_id: timeSlotId });
  }

  deleteBookingBySlot(slotId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bookings/slot/${slotId}`);
  }

  getUserBookings(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bookings/user/${userId}`);
  }
}
