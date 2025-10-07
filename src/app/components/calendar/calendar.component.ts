import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService, TimeSlot } from '../../services/api.service';
import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatChipsModule, 
    MatTooltipModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  timeSlots: TimeSlot[] = [];
  filteredSlots: TimeSlot[] = [];
  currentWeekStart: Date = new Date();
  currentUser: any = null;
  userPreferences: string[] = [];
  selectedCategory: string | null = null;
  weekDays: Date[] = [];

  constructor(
    private apiService: ApiService,
    private userStateService: UserStateService
  ) {}

  ngOnInit() {
    this.setWeekStart(new Date());
    
    this.userStateService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.loadTimeSlots();
    });

    this.userStateService.preferences$.subscribe(prefs => {
      this.userPreferences = prefs;
      this.loadTimeSlots();
    });
  }

  setWeekStart(date: Date) {
    const day = date.getDay();
    const diff = date.getDate() - day;
    this.currentWeekStart = new Date(date.setDate(diff));
    this.currentWeekStart.setHours(0, 0, 0, 0);
    this.weekDays = this.getWeekDays();
    this.loadTimeSlots();
  }

  getWeekDays(): Date[] {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(this.currentWeekStart);
      day.setDate(this.currentWeekStart.getDate() + i);
      days.push(day);
    }
    return days;
  }

  previousWeek() {
    const newDate = new Date(this.currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    this.setWeekStart(newDate);
  }

  nextWeek() {
    const newDate = new Date(this.currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    this.setWeekStart(newDate);
  }

  thisWeek() {
    this.setWeekStart(new Date());
  }

  loadTimeSlots() {
    const weekEnd = new Date(this.currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const startDate = this.currentWeekStart.toISOString();
    const endDate = weekEnd.toISOString();

    this.apiService.getTimeSlots(startDate, endDate).subscribe({
      next: (slots) => {
        this.timeSlots = slots;
        this.filterSlots();
      },
      error: (error) => console.error('Error loading time slots:', error)
    });
  }

  filterSlots() {
    let filtered = this.timeSlots;

    if (this.userPreferences.length > 0) {
      filtered = filtered.filter(slot => this.userPreferences.includes(slot.category));
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(slot => slot.category === this.selectedCategory);
    }

    this.filteredSlots = filtered;
  }

  selectCategory(category: string | null) {
    this.selectedCategory = category;
    this.filterSlots();
  }

  getSlotsByDay(day: Date): TimeSlot[] {
    return this.filteredSlots.filter(slot => {
      const slotDate = new Date(slot.start_time);
      return slotDate.toDateString() === day.toDateString();
    });
  }

  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  canBook(slot: TimeSlot): boolean {
    return !!this.currentUser && !slot.booking;
  }

  isMyBooking(slot: TimeSlot): boolean {
    return !!this.currentUser && !!slot.booking && slot.booking.user_id === this.currentUser.id;
  }

  bookSlot(slot: TimeSlot) {
    if (!this.currentUser || slot.booking) return;

    this.apiService.createBooking(this.currentUser.id, slot.id).subscribe({
      next: () => {
        this.loadTimeSlots();
      },
      error: (error) => console.error('Error booking slot:', error)
    });
  }

  cancelBooking(slot: TimeSlot) {
    if (!this.currentUser || !slot.booking) return;

    this.apiService.deleteBookingBySlot(slot.id).subscribe({
      next: () => {
        this.loadTimeSlots();
      },
      error: (error) => console.error('Error cancelling booking:', error)
    });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getDayName(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
}
