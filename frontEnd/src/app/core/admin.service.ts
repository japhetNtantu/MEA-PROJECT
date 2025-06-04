import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Customer } from '../models/users.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private adminUrl = `${environment.apiUrl}/admin`;
  private tokenKey = 'access_token';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    return token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();
  }

  /**
   * Vérifie la santé du service backend.
   * Correspond à l'endpoint GET `/admin/health`.
   */
  healthCheck(): Observable<{ status: string; message: string }> {
    return this.http
      .get<{ status: string; message: string }>(`${this.adminUrl}/health`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Récupère les statistiques du tableau de bord admin.
   * Correspond à l'endpoint GET `/admin/dashboard`.
   */
  getDashboard(): Observable<{ total_users: number; admin: string }> {
    return this.http
      .get<{ total_users: number; admin: string }>(
        `${this.adminUrl}/dashboard`,
        {
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Récupère la liste complète des utilisateurs (admin uniquement).
   * Correspond à l'endpoint GET `/admin/users`.
   */
  getAllUsers(): Observable<Customer[]> {
    return this.http
      .get<Customer[]>(`${this.adminUrl}/users`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  deleteUser(userId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.adminUrl}/users/${userId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Gère les erreurs HTTP.
   * @param error L'erreur HTTP.
   * @returns Un Observable d'erreur.
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (
      error.error &&
      typeof error.error === 'object' &&
      error.error.detail
    ) {
      errorMessage = `Server Error: ${error.error.detail}`;
    } else if (error.status) {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
