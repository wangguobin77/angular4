import { NgModule,OnInit  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KendoModule } from '../../../../+common/module/kendo.module'

import { HistoryComponent } from './history.component';

import { AuthGuardService } from '../../../../+common/services/auth-guard.service';

const routes: Routes = [
    { path: ':id', component: HistoryComponent },
];

const routing = RouterModule.forChild(routes);

@NgModule({
    imports: [routing, KendoModule],
    declarations: [HistoryComponent]
})
export class HistoryModule
{
    
}