import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { User, UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private userService: UserService,
              private router: Router) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<true|UrlTree> {
    const user: User = await this.userService.getCurrentUser();
    if (user) {
      return true;
    } else {
      return this.router.parseUrl('/auth/login');
    }
  }

  async canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<true | UrlTree> {
    return this.canActivate(route, state);
  }
}
