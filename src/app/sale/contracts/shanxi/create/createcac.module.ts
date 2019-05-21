import { NgModule,OnInit  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KendoModule } from '../../../../+common/module/kendo.module'

import { CreateComponent } from './create.component';

import { AuthGuardService } from '../../../../+common/services/auth-guard.service';

const routes: Routes = [
    { path: '', component: CreateComponent, canActivate: [AuthGuardService] },
    { path: ':pid', component: CreateComponent, canActivate: [AuthGuardService] },
];

const routing = RouterModule.forChild(routes);

@NgModule({
    imports: [routing, KendoModule],
    declarations: [CreateComponent]
})
export class CreateModule
{
    
}