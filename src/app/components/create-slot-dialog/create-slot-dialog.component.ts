import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-create-slot-dialog',
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './create-slot-dialog.html',
  styleUrl: './create-slot-dialog.css'
})
export class CreateSlotDialogComponent {
  category = '';
  title = '';
  description = '';
  date: Date | null = null;
  startTime = '';
  endTime = '';

  constructor(
    private dialogRef: MatDialogRef<CreateSlotDialogComponent>,
    private apiService: ApiService
  ) {}

  isValid(): boolean {
    return !!(this.category && this.title && this.date && this.startTime && this.endTime);
  }

  onCreate() {
    if (!this.isValid()) return;

    const startDateTime = new Date(this.date!);
    const [startHour, startMinute] = this.startTime.split(':');
    startDateTime.setHours(parseInt(startHour), parseInt(startMinute));

    const endDateTime = new Date(this.date!);
    const [endHour, endMinute] = this.endTime.split(':');
    endDateTime.setHours(parseInt(endHour), parseInt(endMinute));

    const slotData = {
      category: this.category,
      title: this.title,
      description: this.description,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString()
    };

    this.apiService.createTimeSlot(slotData).subscribe({
      next: () => {
        this.dialogRef.close(true);
        alert('Slot created successfully');
      },
      error: (error) => console.error('Error creating time slot:', error)
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}

