import { NgModule, Component, OnInit } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { AuthService } from '../+common/services/auth.service';
import { User } from 'oidc-client';

@Component({
    selector: 'app-oauth',
    template: '<i>{{displayText}}</i>'
})
export class AuthComponent implements OnInit {

    displayText: string;
    constructor(private authSvc: AuthService, private router: Router) {
        this.getSellerInfo();
    }
    ngOnInit() {

    }

    async getSellerInfo() {
        let resp: User;
        try {
            resp = await this.authSvc.mgr.signinRedirectCallback();
        } catch (err) {
            //console.error(err);
            localStorage.removeItem('_currentUser');
            localStorage.removeItem('_currentTradingCenter');
            localStorage.removeItem('_currentSeller');
        }
        if (resp == null || resp === undefined) {
            this.displayText = '登录回调错误！';
        } else {
            this.authSvc.currentUser = resp;
            await this.authSvc.getSellerInfo();
            if ((this.authSvc.currentSeller.tradingCenters &&
                this.authSvc.currentSeller.tradingCenters.length > 0) ||
                !this.authSvc.IsInRole('ITAdmin')) {
                window.location.href = '/';
            } else if (this.authSvc.currentSeller.id === undefined ||
                this.authSvc.currentSeller.id == null ||
                this.authSvc.currentSeller.id === '00000000-0000-0000-0000-000000000000') {
                window.location.href = '/workbench/unauthorized';
            } else {
                window.location.href = '/workbench/unauthorized';
            }
        }
    }
}

const routes: Routes = [
    { path: '', component: AuthComponent },
];

const routing = RouterModule.forChild(routes);

@NgModule({
    imports: [routing, RouterModule],
    declarations: [AuthComponent],
    exports: [AuthComponent],
})
export class AuthModule { }
