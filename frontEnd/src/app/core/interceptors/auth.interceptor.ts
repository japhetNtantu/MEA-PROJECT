import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private usersService: UsersService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.usersService.authTokenSubject.value;

    let authReq = request;
    if (authToken) {
      authReq = request.clone({
        headers: new HttpHeaders({
          Authorization: `Bearer ${authToken}`
        })
      });
    }


    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          console.error('Authentication error:', error);
          this.usersService.logout(); 
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
