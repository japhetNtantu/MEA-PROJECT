import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Customer } from '../models/users.model';
import { LoginRequest, Token } from '../models/auth.model';


interface ApiErrorResponse {
  detail: string;
}


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'http://localhost:8000/users';
  private tokenKey = 'access_token';

  private currentUserSubject: BehaviorSubject<Customer | null>;
  public currentUser$: Observable<Customer | null>; 

  public authTokenSubject = new BehaviorSubject<string | null>(localStorage.getItem(this.tokenKey));
  public authToken$ = this.authTokenSubject.asObservable();

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Customer | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();

    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.authTokenSubject.next(token);
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authTokenSubject.value;
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }

  isAuthenticated(): boolean {
    return !!this.authTokenSubject.value;
  }

  setCurrentUser(user: Customer | null): void {
    this.currentUserSubject.next(user);
  }

  /**
   * Enregistre un nouveau client.
   * Correspond à l'endpoint POST `/register`.
   * @param customer Les données d'enregistrement du client (incluant le mot de passe).
   * @returns Un Observable du client créé.
   */
  registerCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/register`, customer).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Connecte un utilisateur et récupère un token JWT.
   * Correspond à l'endpoint POST `/login`.
   * @param credentials Les identifiants de connexion (username, password).
   * @returns Un Observable du Token.
   */
  login(credentials: LoginRequest): Observable<Token> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Token>(`${this.apiUrl}/login`, credentials, { headers }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.access_token);
        this.authTokenSubject.next(response.access_token);
        this.getMe().subscribe({
          next: (user) => this.setCurrentUser(user),
          error: (err) => console.error('Failed to get user after login:', err)
        });
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.authTokenSubject.next(null);
    this.setCurrentUser(null);
  }

  /**
   * Récupère tous les clients.
   * Correspond à l'endpoint GET `/`.
   * @returns Un Observable d'un tableau de Customer.
   */
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère les informations de l'utilisateur actuellement authentifié.
   * Correspond à l'endpoint GET `/me`.
   * @returns Un Observable du Customer authentifié.
   */
  getMe(): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/me`, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
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
    } else if (error.error && typeof error.error === 'object' && error.error.detail) {
      errorMessage = `Server Error: ${error.error.detail}`;
    } else if (error.status) {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
