import { NgModule, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

@Component({
    selector: 'app-authcode',
    template: '<router-outlet></router-outlet>',
})
export class AuthCodeComponent { }
const router: Routes = [
    {
        path: '',
        component: AuthCodeComponent,
        children: [{
            path: 'authsuccess',
            loadChildren: './authsuccess/authsuccess.module#AuthSuccessModule'
        }, {
            path: 'useauthcode',
            loadChildren: './useauthcode/useauthcode.module#UseAuthCodeModule'
        },
        ]
    },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule, RouterModule.forChild(router)],
    declarations: [AuthCodeComponent],
    exports: [RouterModule]
})
export class AuthCodeModule { }
