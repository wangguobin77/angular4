import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class RoleGuardService implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (route.data.authorizedRoles instanceof undefined ||
            route.data.authorizedRoles instanceof null ||
            (route.data.authorizedRoles instanceof Array && route.data.authorizedRoles.length === 0)) {
            return false;
        }
        (route.data.authorizedRoles).forEach(element => {
            if (this.authService.IsInRole(element)) {
                return true;
            }
        });
        return false;
    }
}
