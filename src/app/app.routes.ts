import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { PreferencesComponent } from './components/preferences/preferences.component';


export const routes: Routes = [
  { path: '', redirectTo: '/calendar', pathMatch: 'full' },
  { path: 'preferences', component: PreferencesComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'admin', component: AdminComponent }
];
