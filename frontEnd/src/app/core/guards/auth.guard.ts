import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UsersService } from '../users.service';

export class AuthGuard implements CanActivate {

  constructor(private usersService: UsersService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.usersService.authToken$.pipe(
      take(1),
      map(token => {
        if (token) {
          return true;
        } else {
          console.warn('Accès refusé: utilisateur non authentifié.');
          return this.router.createUrlTree(['/login']);
        }
      })
    );
  }
}
