import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { CartItem } from '../models/cart.model';
import { Pizza } from '../models/pizza.model';
import { UsersService } from './users.service';
import { Customer } from '../models/users.model';
import { OrderItem } from '../models/orders.model';
import { OrderItemService } from './order-item.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<Map<string, CartItem>>(new Map());
  public cartItems$: Observable<Map<string, CartItem>> = this.cartItemsSubject.asObservable();
  public cartTotalItems$: Observable<number>;
  private orderPlacedSubject = new Subject<boolean>();
  public orderPlaced$: Observable<boolean> = this.orderPlacedSubject.asObservable();

  private currentUser: Customer | null = null;
  private userSubscription: Subscription;

  constructor(
    private usersService: UsersService,
    private orderItemService: OrderItemService
  ) {
    this.cartTotalItems$ = this.cartItems$.pipe(
      map(itemsMap => {
        let total = 0;
        itemsMap.forEach(item => total += item.quantity);
        return total;
      })
    );

    this.userSubscription = this.usersService.currentUser$.subscribe(user => {
      if (this.currentUser && this.currentUser.id !== user?.id) {
          this.saveCartToLocalStorage();
      }
      this.currentUser = user;
      this.loadCartForCurrentUser();
    });
  }

  addItem(pizza: Pizza): boolean {
    if (!this.currentUser) {
      console.warn('Cannot add to cart: No user logged in.');
      return false;
    }

    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.get(pizza.id);

    const orderItem: OrderItem = {
      customer_id: this.currentUser.id,
      pizza_id: pizza.id,
      quantity: (item ? item.quantity + 1 : 1)
    };


    this.orderItemService.addCartItemToBackend(orderItem).pipe(
      catchError(error => {
        console.error('Erreur lors de l\'enregistrement de l\'article dans le panier backend:', error);
        return of(null);
      })
    ).subscribe(response => {
      if (response) {
        console.log('Article du panier enregistré sur le backend:', response);
      }
      if (item) {
        item.quantity++;
      } else {
        currentItems.set(pizza.id, { pizza: pizza, quantity: 1 });
      }
      this.cartItemsSubject.next(currentItems);
      this.saveCartToLocalStorage();
    });
    
    return true;
  }

  removeItem(pizzaId: string): void {
    if (!this.currentUser) return;

    const currentItems = this.cartItemsSubject.value;
    currentItems.delete(pizzaId);
    this.cartItemsSubject.next(currentItems);
    this.saveCartToLocalStorage();
  }

  placeOrder(): void {
    if (!this.currentUser) {
      console.warn('Impossible de passer commande: Aucun utilisateur connecté.');
      return;
    }
    this.clearCart();
    this.orderPlacedSubject.next(true); 
    console.log('Commande simulée passée ! Panier vidé.');
  }

  decreaseQuantity(pizzaId: string): void {
    if (!this.currentUser) return;

    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.get(pizzaId);

    if (item) {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        currentItems.delete(pizzaId);
      }
      this.cartItemsSubject.next(currentItems);
      this.saveCartToLocalStorage();
    }
  }

  getCartItems(): CartItem[] {
    return Array.from(this.cartItemsSubject.value.values());
  }

  clearCart(): void {
    if (!this.currentUser) return;

    this.cartItemsSubject.next(new Map());
    this.saveCartToLocalStorage();
  }

  private loadCartForCurrentUser(): void {
    if (this.currentUser) {
      const storageKey = `pizza_cart_${this.currentUser.id}`;
      const storedCart = localStorage.getItem(storageKey);
      if (storedCart) {
        try {
          const itemsArray: [string, CartItem][] = JSON.parse(storedCart);
          this.cartItemsSubject.next(new Map(itemsArray));
        } catch (e) {
          console.error(`Erreur lors du chargement du panier de l'utilisateur ${this.currentUser.id} depuis localStorage`, e);
          this.cartItemsSubject.next(new Map());
        }
      } else {
        this.cartItemsSubject.next(new Map());
      }
    } else {
      this.cartItemsSubject.next(new Map());
    }
  }

  private saveCartToLocalStorage(): void {
    if (this.currentUser) {
      const storageKey = `pizza_cart_${this.currentUser.id}`;
      const itemsArray = Array.from(this.cartItemsSubject.value.entries());
      localStorage.setItem(storageKey, JSON.stringify(itemsArray));
    }
  }
}
