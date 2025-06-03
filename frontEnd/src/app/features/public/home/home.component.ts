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
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
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
  ) { }

  ngOnInit(): void {
    this.loadPizzas();
  }

  loadPizzas(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.pizzaService.getPizzas().pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('Erreur lors du chargement des pizzas depuis le backend réel. Tentative avec les mocks...', error);
        return EMPTY;
      })
    ).subscribe({
      next: (data: Pizza[]) => {
        if (data && data.length > 0) {
          this.pizzas = data;
          this.isLoading = false;
          console.log('Pizzas chargées avec succès depuis le backend :', this.pizzas);
        } else {
          console.log('Backend réel a renvoyé des pizzas vides. Chargement des mocks...');
          this.loadMockPizzas();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur inattendue lors du chargement des pizzas.';
        console.error('Erreur finale inattendue lors du chargement :', error);
      },
      complete: () => {}
    });
  }

  private loadMockPizzas(): void {
    this.pizzaService.getMockPizzas().subscribe({
      next: (data: Pizza[]) => {
        this.pizzas = data;
        this.isLoading = false;
        this.errorMessage = null;
        console.log('Pizzas chargées avec succès depuis les mocks :', this.pizzas);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement des pizzas (mocks inclus). Veuillez réessayer plus tard.';
        console.error('Erreur lors de la récupération des pizzas (même les mocks ont échoué) :', error);
      }
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
        console.log(`Pizza "${pizza.name}" ajoutée au panier !`);
      } else {
        console.warn(`Problème d'ajout au panier. Vérifier les logs du CartService.`);
      }
      this.closePopup();
    } else {
      console.log('Utilisateur non connecté, redirection vers la page de connexion...');
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
}
