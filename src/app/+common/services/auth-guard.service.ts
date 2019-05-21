import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }
    canActivate() {
        return this.getLoggedIn();
    }
    async getLoggedIn() {
        const resp = await this.authService.isLoggedInObs().first().toPromise();
        if (!resp) {
            const s1 = localStorage.getItem('_currentUser');
            const s2 = localStorage.getItem('_currentTradingCenter');
            localStorage.clear();
            localStorage.setItem('_currentUser', s1);
            localStorage.setItem('_currentTradingCenter', s2);
            this.authService.startSigninMainWindow();
        }/* else if (this.authService.currentSeller.id === undefined ||
            this.authService.currentSeller.id == null ||
            this.authService.currentSeller.id === '00000000-0000-0000-0000-000000000000') {
            this.router.navigate(['/enterprisesset']);
        } else if ((this.authService.currentSeller.tradingCenters === undefined ||
            this.authService.currentSeller.tradingCenters == null ||
            this.authService.currentSeller.tradingCenters.length === 0) &&
            !this.authService.IsInRole('ITAdmin')) {
            this.router.navigate(['/store/tradingCenter']);
        }*/
        return resp;
    }
}
