import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from '../../+common/services/auth-guard.service';
import { LayoutModule } from '../../+common/layout/layout.module';

declare var $: any;

@Component({
    selector: 'contractKeep',
    template: '<slidebar></slidebar><router-outlet></router-outlet>'
})
export class ContractKeepComponent {
    ngOnInit() {
        $.showMenu(1);
    }
}

const router: Routes = [
    {
        path: '',
        component: ContractKeepComponent,
        children: [
            {
                path: 'anhui/list',
                loadChildren: './anhui/list/listck.module#ListModule'
            },
            {
                path: 'anhui/detail',
                loadChildren: './anhui/detail/detailck.module#DetailModule'
            },
            {
                path: 'anhui/report',
                loadChildren: './anhui/report/report.module#ReportModule'
            },
            {
                path: 'guangdong/list',
                loadChildren: './guangdong/list/listck.module#ListModule'
            },
            {
                path: 'guangdong/detail',
                loadChildren: './guangdong/detail/detailck.module#DetailModule'
            },
            {
                path: 'guangdong/report',
                loadChildren: './guangdong/report/report.module#ReportModule'
            },
            {
                path: 'shanxi/list',
                loadChildren: './shanxi/list/listck.module#ListModule'
            },
            {
                path: 'shanxi/detail',
                loadChildren: './shanxi/detail/detailck.module#DetailModule'
            },
            {
                path: 'shanxi/report',
                loadChildren: './shanxi/report/report.module#ReportModule'
            }
        ]
    }
];

@NgModule({
    imports: [
        LayoutModule,
        RouterModule.forChild(router)
    ],
    declarations: [ContractKeepComponent],
    exports: [
        RouterModule
    ]
})
export class ContractKeepModule { }
