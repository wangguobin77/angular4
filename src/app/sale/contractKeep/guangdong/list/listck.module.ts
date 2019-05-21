import { NgModule, OnInit } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list.component';

import { AuthGuardService } from '../../../../+common/services/auth-guard.service';

import { KendoModule } from '../../../../+common/module/kendo.module'

const routes: Routes = [
    { path: '', component: ListComponent, canActivate: [AuthGuardService] },
];

const routing = RouterModule.forChild(routes);


@NgModule({
    imports: [routing, KendoModule],
    declarations: [ListComponent],
    providers: []
})
export class ListModule {

}
