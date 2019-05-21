import { NgModule, OnInit } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { ReportComponent } from './report.component';

import { AuthGuardService } from '../../../../+common/services/auth-guard.service';

import { KendoModule } from '../../../../+common/module/kendo.module';

const routes: Routes = [
    { path: '', component: ReportComponent, canActivate: [AuthGuardService] },
];

const routing = RouterModule.forChild(routes);


@NgModule({
    imports: [routing, KendoModule],
    declarations: [ReportComponent],
    providers: []
})
export class ReportModule {

}
