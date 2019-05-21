import { NgModule, Component ,OnInit} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../+common/header/header.module';


import { sellerinfo } from './sellerinfo/sellerinfo';



import { LayoutModule } from '../+common/layout/layout.module';
declare var $: any;

@Component({
    selector: 'enterpriseinfo',
    template: '<router-outlet></router-outlet>',
})
export class enterpriseinfoComponent {
}
const router: Routes = [
    {
        path: '',
        component: enterpriseinfoComponent,
        children: [

            {
                path: 'sellerinfo',
                loadChildren: './sellerinfo/sellerinfo.module#sellerinfoModule'
            },






        ]

    },



];

@NgModule({

    imports: [
        LayoutModule,
        CommonModule,
        FormsModule, HeaderModule, RouterModule.forChild(router)],
    declarations: [
        enterpriseinfoComponent,

    ],


    exports: [
        RouterModule
    ]
})
export class enterpriseinfoModule { }


