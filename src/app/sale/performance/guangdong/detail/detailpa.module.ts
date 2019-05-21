import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DetailComponent } from './detail.component'
import { DetailService } from './detail.service'

import { KendoModule } from '../../../../+common/module/kendo.module'
//import { AuthGuardService } from '../../../../+common/services/auth-guard.service';

const router: Routes = [
    {
        path: ':id',
        component: DetailComponent
    }
];


@NgModule({
    imports: [
        KendoModule,
        RouterModule.forChild(router)
    ],
    declarations: [DetailComponent],
    providers: [DetailService]
})
export class GDDetailModule {
    
 }