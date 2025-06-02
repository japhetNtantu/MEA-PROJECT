import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UsersService } from './core/users.service';
import { Customer } from './models/users.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PIZZA-SERVICE';
  currentUser: Customer | null = null;
  private userSubscription: Subscription | undefined;

  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.usersService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    if (this.usersService.isAuthenticated()) {
      this.usersService.getMe().subscribe({
        next: (user) => {
          this.usersService.setCurrentUser(user);
        },
        error: (err) => {
          console.warn('Could not fetch current user on app start:', err);
          this.usersService.logout();
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.usersService.logout();
    this.router.navigate(['/auth/login']);
  }
}
