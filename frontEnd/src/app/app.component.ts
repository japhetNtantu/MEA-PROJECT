import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UsersService } from './core/users.service';
import { CartService } from './core/cart.service';
import { Customer } from './models/users.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PIZZA-SERVICE';
  currentUser: Customer | null = null;
  cartItemCount: number = 0;
  private userSubscription: Subscription | undefined;
  private cartSubscription: Subscription | undefined;
  private orderSubscription: Subscription | undefined;

  showCartDropdown: boolean = false; // Nouvelle propriété pour contrôler la visibilité du dropdown
  showOrderSuccessSnapshot: boolean = false;

  constructor(
    private usersService: UsersService,
    private cartService: CartService, // Injecté ici
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.usersService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.cartSubscription = this.cartService.cartTotalItems$.subscribe(count => {
      this.cartItemCount = count;
    });

    this.orderSubscription = this.cartService.orderPlaced$.subscribe(() => {
      this.displayOrderSuccess();
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

  toggleCartDropdown(event: Event): void {
    event.preventDefault(); 
    this.showCartDropdown = !this.showCartDropdown;
  }

  onCloseCartDropdown(): void {
    this.showCartDropdown = false;
  }


  displayOrderSuccess(): void {
    this.showOrderSuccessSnapshot = true;
    setTimeout(() => {
      this.showOrderSuccessSnapshot = false;
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.orderSubscription) { 
      this.orderSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.usersService.logout();
    this.router.navigate(['/auth/login']);
  }
}
