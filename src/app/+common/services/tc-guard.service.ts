import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class TCGuardService implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (route.data.enabledTradingCenters instanceof undefined ||
            route.data.enabledTradingCenters instanceof null ||
            (route.data.enabledTradingCenters instanceof Array && route.data.enabledTradingCenters.length === 0)) {
            return false;
        }
        (route.data.enabledTradingCenters as string[]).forEach((ele) => {
            if (this.authService.currentTradingCenter.appId === ele) {
                return true;
            }
        });
        // 如果当前交易中心不存在该页面，但用户确实激活了这个交易中心，是否转换当前交易中心？
        return false;
    }
}
