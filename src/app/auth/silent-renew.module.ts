import { NgModule, Component, OnInit } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { AuthService } from '../+common/services/auth.service';

@Component({
    selector: 'app-OAuthSilentRenew',
    template: '<i>{{displayText}}</i>'
})

export class SilentRenewComponent implements OnInit {
    displayText: string;
    constructor(private authSvc: AuthService, private router: Router) { }
    ngOnInit() {
        this.renewSellerInfo();
    }

    async renewSellerInfo() {
        const resp = await this.authSvc.mgr.signinSilentCallback();
        if (resp == null || resp === undefined) {
            this.displayText = '登录回调错误！';
        } else {
            await this.authSvc.getSellerInfo();
        }
    }
}

const routes: Routes = [
    { path: '', component: SilentRenewComponent },
];

const routing = RouterModule.forChild(routes);

@NgModule({
    imports: [routing, RouterModule],
    declarations: [SilentRenewComponent],
    exports: [SilentRenewComponent],
})

export class SilentRenewModule { }
