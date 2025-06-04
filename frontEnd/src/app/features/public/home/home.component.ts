// ✅ TypeScript (home.component.ts)
import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { PizzaService } from 'src/app/core/pizza.service';
import { Pizza } from 'src/app/models/pizza.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CartService } from 'src/app/core/cart.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/core/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  pizzas: Pizza[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  showPopup: boolean = false;
  selectedPizza: Pizza | null = null;

  constructor(
    private pizzaService: PizzaService,
    private cartService: CartService,
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPizzas();
  }

  isAdmin = (): boolean => {
    return this.usersService.isAdmin();
  };

  loadPizzas(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.pizzaService
      .getPizzas()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.warn('Erreur backend, utilisation des mocks...', error);
          return EMPTY;
        })
      )
      .subscribe({
        next: (data: Pizza[]) => {
          if (data && data.length > 0) {
            this.pizzas = data;
          } else {
            this.loadMockPizzas();
          }
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Erreur lors du chargement des pizzas.';
        },
      });
  }

  private loadMockPizzas(): void {
    this.pizzaService.getMockPizzas().subscribe({
      next: (data: Pizza[]) => {
        this.pizzas = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur de chargement des pizzas (mocks inclus).';
        this.isLoading = false;
      },
    });
  }

  onSelectPizza(pizza: Pizza): void {
    this.selectedPizza = pizza;
    this.showPopup = true;
  }

  onAddToCart(pizza: Pizza): void {
    if (this.usersService.isAuthenticated()) {
      const added = this.cartService.addItem(pizza);
      if (added) {
        console.log(`Pizza "${pizza.name}" ajoutée.`);
      }
      this.closePopup();
    } else {
      this.closePopup();
      this.router.navigate(['/auth/login']);
    }
  }

  onCancelAdd(): void {
    this.closePopup();
  }

  closePopup(): void {
    this.showPopup = false;
    this.selectedPizza = null;
  }

  onSidebarOptionClick(option: string): void {
    console.log(`Option sélectionnée: ${option}`);
    // Implémente la navigation si nécessaire
    // this.router.navigate([`/${option}`]);
  }
}
