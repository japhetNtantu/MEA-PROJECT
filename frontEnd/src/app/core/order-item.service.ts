import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; 

import { OrderItem } from 'src/app/models/orders.model';

@Injectable({
  providedIn: 'root'
})
export class OrderItemService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  /**
   * Enregistre un article de panier.
   * @param orderItem L'article de panier à enregistrer.
   * @returns Un Observable de la réponse du backend.
   */
  addCartItemToBackend(orderItem: OrderItem): Observable<OrderItem> {
    console.log('Envoi de l\'article au backend:', orderItem);
    return this.http.post<OrderItem>(`${this.apiUrl}/cart`, orderItem);
  }

}
