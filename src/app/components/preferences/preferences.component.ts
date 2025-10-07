import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../services/api.service';
import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-preferences',
  imports: [
    CommonModule, 
    MatChipsModule, 
    MatIconModule, 
    MatCardModule
  ],
  templateUrl: './preferences.html',
  styleUrl: './preferences.css'
})
export class PreferencesComponent implements OnInit {
  availableCategories = ['Cat 1', 'Cat 2', 'Cat 3'];
  selectedCategories: string[] = [];
  currentUser: any = null;

  constructor(
    private apiService: ApiService,
    private userStateService: UserStateService
  ) {}

  ngOnInit() {
    this.userStateService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadPreferences();
      }
    });
  }

  loadPreferences() {
    if (this.currentUser) {
      this.apiService.getUserPreferences(this.currentUser.id).subscribe({
        next: (prefs) => {
          this.selectedCategories = prefs.map(p => p.category);
          this.userStateService.setPreferences(this.selectedCategories);
        },
        error: (error) => console.error('Error loading preferences:', error)
      });
    }
  }

  isSelected(category: string): boolean {
    return this.selectedCategories.includes(category);
  }

  toggleCategory(category: string) {
    if (!this.currentUser) return;

    if (this.isSelected(category)) {
      this.apiService.deleteUserPreference(this.currentUser.id, category).subscribe({
        next: () => {
          this.selectedCategories = this.selectedCategories.filter(c => c !== category);
          this.userStateService.setPreferences(this.selectedCategories);
        },
        error: (error) => console.error('Error removing preference:', error)
      });
    } else {
      this.apiService.addUserPreference(this.currentUser.id, category).subscribe({
        next: () => {
          this.selectedCategories.push(category);
          this.userStateService.setPreferences(this.selectedCategories);
        },
        error: (error) => console.error('Error adding preference:', error)
      });
    }
  }
}

