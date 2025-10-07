import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { UserSelectorComponent } from './components/user-selector/user-selector';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    MatToolbarModule, 
    MatButtonModule, 
    UserSelectorComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Event Booking System';
}
