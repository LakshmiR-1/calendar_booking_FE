import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatButtonModule, 
    MatCheckboxModule
],
  templateUrl: './create-user-dialog.html',
  styleUrl: './create-user-dialog.css'
})
export class CreateUserDialogComponent {
  username = '';
  isAdmin = false;

  constructor(
    private dialogRef: MatDialogRef<CreateUserDialogComponent>,
    private apiService: ApiService
  ) {}

  onCreate() {
    if (this.username) {
      this.apiService.createUser(this.username, this.isAdmin).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => console.error('Error creating user:', error)
      });
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
