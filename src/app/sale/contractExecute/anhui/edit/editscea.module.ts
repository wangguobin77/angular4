import { NgModule, OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditComponent } from './edit.component';

import { KendoModule } from '../../../../+common/module/kendo.module'

import { AuthGuardService } from '../../../../+common/services/auth-guard.service';

const routes: Routes = [
    { path: ':date', component: EditComponent, canActivate: [AuthGuardService] },
];

const routing = RouterModule.forChild(routes);

@NgModule({
    imports: [routing, KendoModule],
    declarations: [EditComponent]
})
export class EditModule {

}
