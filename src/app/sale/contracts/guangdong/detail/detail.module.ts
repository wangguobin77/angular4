import { NgModule,OnInit  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './detail.component';

import { AuthGuardService } from '../../../../+common/services/auth-guard.service';

const routes: Routes = [
    { path: ':id', component: DetailComponent, canActivate: [AuthGuardService] },
];

const routing = RouterModule.forChild(routes);

@NgModule({
    imports: [routing,CommonModule],
    declarations: [DetailComponent]
})
export class DetailModule
{
    
}