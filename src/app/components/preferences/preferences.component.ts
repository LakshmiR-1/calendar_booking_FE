import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class PreferencesComponent implements OnInit, OnDestroy {
  availableCategories = ['Cat 1', 'Cat 2', 'Cat 3'];
  selectedCategories: string[] = [];
  private preferencesSub: any;
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
    // Subscribe to preferences$ to keep selectedCategories in sync
    this.preferencesSub = this.userStateService.preferences$.subscribe(prefs => {
      this.selectedCategories = prefs || [];
    });
  }

  ngOnDestroy() {
    if (this.preferencesSub) {
      this.preferencesSub.unsubscribe();
    }
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

    // Optimistic update: update UI immediately
    let updated: string[];
    if (this.isSelected(category)) {
      updated = this.selectedCategories.filter(c => c !== category);
      this.userStateService.setPreferences(updated);
      this.apiService.deleteUserPreference(this.currentUser.id, category).subscribe({
        next: () => {},
        error: (error) => {
          // Revert on error
          this.userStateService.setPreferences([...this.selectedCategories, category]);
          console.error('Error removing preference:', error);
        }
      });
    } else {
      updated = [...this.selectedCategories, category];
      this.userStateService.setPreferences(updated);
      this.apiService.addUserPreference(this.currentUser.id, category).subscribe({
        next: () => {},
        error: (error) => {
          // Revert on error
          this.userStateService.setPreferences(this.selectedCategories.filter(c => c !== category));
          console.error('Error adding preference:', error);
        }
      });
    }
  }
}

