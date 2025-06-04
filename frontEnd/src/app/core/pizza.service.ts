import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, delay, of, throwError } from 'rxjs';
import { Pizza } from '../models/pizza.model';
import { environment } from '../../environments/environment';
import { v4 as uuidv4 } from 'uuid';

interface StatusResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PizzaService {

  private apiUrl = `${environment.apiUrl}/pizzas`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère toutes les pizzas disponibles depuis le back-end.
   * Correspond à l'endpoint GET `/`.
   * @returns Un Observable d'un tableau de Pizza.
   */
  getPizzas(): Observable<Pizza[]> {
    return this.http.get<Pizza[]>(this.apiUrl);
  }

  /**
   * Récupère une pizza spécifique par son ID.
   * Correspond à l'endpoint GET `/{pk}`.
   * @param id L'ID UUID de la pizza.
   * @returns Un Observable d'une Pizza.
   */
  getPizzaById(id: string): Observable<Pizza> {
    return this.http.get<Pizza>(`${this.apiUrl}/${id}`);
  }

  /**
   * Supprime une pizza par son ID.
   * Correspond à l'endpoint DELETE `/{pk}`.
   * @param id L'ID UUID de la pizza à supprimer.
   * @returns Un Observable de l'objet de statut de confirmation.
   */
  deletePizza(id: string): Observable<StatusResponse> {
    return this.http.delete<StatusResponse>(`${this.apiUrl}/${id}`);
  }

  getMockPizzas(): Observable<Pizza[]> {
    const mockPizzas: Pizza[] = [
      {
        id: uuidv4(),
        name: 'Margherita Classique',
        image_url: 'https://images.unsplash.com/photo-1594007654729-407edc192ba0?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        description: 'Tomate, Mozzarella, Basilic frais, Huile d\'olive extra vierge.',
        price: 9.50
      },
      {
        id: uuidv4(),
        name: 'Reine Jambon Fromage',
        image_url: 'https://images.unsplash.com/photo-1579737976694-a169b177d697?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        description: 'Tomate, Mozzarella, Jambon, Champignons frais.',
        price: 11.00
      },
      {
        id: uuidv4(),
        name: 'Quatre Fromages',
        image_url: 'https://images.unsplash.com/photo-1594007654729-407edc192ba0?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Réutilise une image ou trouve-en une autre
        description: 'Mozzarella, Chèvre, Gorgonzola, Parmesan.',
        price: 12.50
      },
      {
        id: uuidv4(),
        name: 'Végétarienne du Jardin',
        image_url: 'https://images.unsplash.com/photo-1628842426993-9c2b4c10f7ac?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        description: 'Tomate, Mozzarella, Poivrons, Oignons, Olives, Champignons.',
        price: 10.50
      },
      {
        id: uuidv4(),
        name: 'Pepperoni Inferno',
        image_url: 'https://images.unsplash.com/photo-1628842426993-9c2b4c10f7ac?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        description: 'Tomate, Mozzarella, Pepperoni épicé, Piments frais.',
        price: 12.00
      }
    ];

    return of(mockPizzas).pipe(delay(500));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur inconnue est survenue!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.detail) {
        errorMessage = `Erreur de l'API: ${error.error.detail}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
