import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService, User } from '../../services/api.service';
import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-user-selector',
  imports: [
    CommonModule, 
    FormsModule, 
    MatSelectModule, 
    MatFormFieldModule, 
    MatButtonModule, 
    MatInputModule, 
    MatDialogModule
  ],
  templateUrl: './user-selector.html',
  styleUrl: './user-selector.css'
})
export class UserSelectorComponent implements OnInit {
  users: User[] = [];
  selectedUserId: number | null = null;

  constructor(
    private apiService: ApiService,
    private userStateService: UserStateService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadUsers();
    const currentUser = this.userStateService.getCurrentUser();
    if (currentUser) {
      this.selectedUserId = currentUser.id;
    }
  }

  loadUsers() {
    this.apiService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => console.error('Error loading users:', error)
    });
  }

  onUserChange() {
    if (this.selectedUserId) {
      this.apiService.getUser(this.selectedUserId).subscribe({
        next: (user) => {
          this.userStateService.setCurrentUser(user);
          this.loadUserPreferences(user.id);
        },
        error: (error) => console.error('Error loading user:', error)
      });
    }
  }

  loadUserPreferences(userId: number) {
    this.apiService.getUserPreferences(userId).subscribe({
      next: (prefs) => {
        this.userStateService.setPreferences(prefs.map(p => p.category));
      },
      error: (error) => console.error('Error loading preferences:', error)
    });
  }

  openCreateUserDialog() {
    import('../create-user-dialog/create-user-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.CreateUserDialogComponent, {
        width: '400px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadUsers();
        }
      });
    });
  }
}

