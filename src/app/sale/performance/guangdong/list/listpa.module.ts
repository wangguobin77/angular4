import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListComponent } from './list.component'
import { DataService } from './list.service'

import { KendoModule } from '../../../../+common/module/kendo.module'
//import { AuthGuardService } from '../../../../+common/services/auth-guard.service';

const router: Routes = [
    {
        path: '',
        component: ListComponent
    }
];


@NgModule({
    imports: [
        KendoModule,
        RouterModule.forChild(router)
    ],
    declarations: [ListComponent],
    providers: [DataService]
})
export class GDListModule {
    
 }