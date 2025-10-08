import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService, TimeSlot } from '../../services/api.service';
import { UserStateService } from '../../services/user-state.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule, 
    FormsModule, 
    MatCardModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent implements OnInit {
  timeSlots: TimeSlot[] = [];
  currentUser: any = null;
  displayedColumns: string[] = ['category', 'title', 'start_time', 'end_time', 'booking', 'actions'];

  constructor(
    private apiService: ApiService,
    private userStateService: UserStateService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
      this.userStateService.currentUser$.subscribe(user => {
          this.currentUser = user;
          if (user && user.is_admin) {
            this.loadTimeSlots();
          }
    });
  }

  loadTimeSlots() {
    this.apiService.getTimeSlots().subscribe({
      next: (slots) => {
          this.timeSlots = slots;
      },
      error: (error) => console.error('Error loading time slots:', error)
    });
  }

  formatDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  openCreateSlotDialog() {
    import('../create-slot-dialog/create-slot-dialog.component').then(m => {
      const dialogRef = this.dialog.open(m.CreateSlotDialogComponent, {
        width: '500px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadTimeSlots();
        }
      });
    });
  }

  deleteSlot(slot: TimeSlot) {
    if (confirm(`Are you sure you want to delete "${slot.title}"?`)) {
      this.apiService.deleteTimeSlot(slot.id).subscribe({
        next: () => {
          this.loadTimeSlots();
        },
        error: (error) => console.error('Error deleting slot:', error)
      });
    }
  }
}

