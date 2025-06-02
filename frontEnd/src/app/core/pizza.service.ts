import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pizza } from '../models/pizza.model';

interface StatusResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PizzaService {

  private apiUrl = 'http://localhost:8000/pizzas';

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
}
