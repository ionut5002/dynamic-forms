import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {
    authService.onAuthStateChanged().subscribe((user: User | null) => {
      this.isLoggedIn = !!user;
    });
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out', error);
    }
  }
}
