import { NgModule, OnInit } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { DetailComponent } from './detail.component';

import { AuthGuardService } from '../../../../+common/services/auth-guard.service';

import { KendoModule } from '../../../../+common/module/kendo.module'

import { ShufflingModule }  from '../../../../+common/shuffling/shuffling.module';

const routes: Routes = [
    { path: ':id', component: DetailComponent, canActivate: [AuthGuardService] },
];

const routing = RouterModule.forChild(routes);


@NgModule({
    imports: [routing, KendoModule,ShufflingModule],
    declarations: [DetailComponent],
    providers: []
})
export class DetailModule {

}
