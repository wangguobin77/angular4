import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AppGuardService implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (route.data.enabledApplications instanceof undefined ||
            route.data.enabledApplications instanceof null ||
            (route.data.enabledApplications instanceof Array && route.data.enabledApplications.length === 0)) {
            return false;
        }
        (route.data.enabledApplications as string[]).forEach((eX) => {
            this.authService.currentSeller.applications.forEach((eY) => {
                if (eX === eY.id) {
                    return true;
                }
            });
        });
        return false;
    }
}
