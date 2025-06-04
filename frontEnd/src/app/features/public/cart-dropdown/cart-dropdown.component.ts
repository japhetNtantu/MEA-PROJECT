import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CartService } from 'src/app/core/cart.service';
import { CartItem } from 'src/app/models/cart.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-dropdown',
  templateUrl: './cart-dropdown.component.html',
  styleUrls: ['./cart-dropdown.component.css']
})
export class CartDropdownComponent {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  private cartItemsSubscription: Subscription | undefined;

  @Output() closeDropdown = new EventEmitter<void>();

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartItemsSubscription = this.cartService.cartItems$.subscribe(itemsMap => {
      this.cartItems = Array.from(itemsMap.values()); 
      this.calculateTotal();
    });
  }

  ngOnDestroy(): void {
    if (this.cartItemsSubscription) {
      this.cartItemsSubscription.unsubscribe();
    }
  }

  private calculateTotal(): void {
    this.cartTotal = this.cartItems.reduce((acc, item) => acc + (item.pizza.price * item.quantity), 0);
  }

  increaseQuantity(pizzaId: string): void {
    const item = this.cartService.getCartItems().find(i => i.pizza.id === pizzaId);
    if (item) {
      this.cartService.addItem(item.pizza);
    }
  }

  decreaseQuantity(pizzaId: string): void {
    this.cartService.decreaseQuantity(pizzaId);
  }

  removeItem(pizzaId: string): void {
    this.cartService.removeItem(pizzaId);
  }

  placeOrder(): void {
    this.cartService.placeOrder(); 
    this.closeDropdown.emit();
  }

  onClose(): void {
    this.closeDropdown.emit();
  }
}
