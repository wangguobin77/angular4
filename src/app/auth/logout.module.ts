import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { AuthService } from '../+common/services/auth.service';

@Component({
    selector: 'app-logout',
    template: '<a>logout</a>'
})
export class LogoutComponent {
    constructor(private authSvc: AuthService, private router: Router) {
        authSvc.startSignoutMainWindow();
    }
}

const routes: Routes = [
    { path: '', component: LogoutComponent },
];

const routing = RouterModule.forChild(routes);

@NgModule({
    imports: [routing, RouterModule],
    declarations: [LogoutComponent],
})

export class LogoutModule { }
