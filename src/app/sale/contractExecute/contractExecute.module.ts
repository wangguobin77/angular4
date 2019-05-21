import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from '../../+common/services/auth-guard.service';
import { LayoutModule } from '../../+common/layout/layout.module';

declare var $: any;

@Component({
    selector: 'contractExecute',
    template: '<slidebar></slidebar><router-outlet></router-outlet>'
})
export class ContractExecuteComponent {
    ngOnInit() {
        $.showMenu(1);
    }
    ngAfterViewInit(){
        $.showSide(10502);
    }
}


const router: Routes = [
    {
        path: '',
        component: ContractExecuteComponent,
        children: [
            {
                path: 'anhui/list',
                loadChildren: './anhui/list/listscea.module#ListModule'
            },
            {
                path: 'anhui/edit',
                loadChildren: './anhui/edit/editscea.module#EditModule'
            },
            {
                path: 'guangdong/list',
                loadChildren: './guangdong/list/listscea.module#ListModule'
            },
            {
                path: 'guangdong/edit',
                loadChildren: './guangdong/edit/editscea.module#EditModule'
            },
            {
                path: 'shanxi/list',
                loadChildren: './shanxi/list/listscea.module#ListModule'
            },
            {
                path: 'shanxi/edit',
                loadChildren: './shanxi/edit/editscea.module#EditModule'
            },
            {
                path: 'shanxi/park',
                loadChildren: './shanxi/park/park.module#ParkModule'
            }
        ]
    }
];

@NgModule({
    imports: [
        LayoutModule,
        RouterModule.forChild(router)
    ],
    declarations: [ContractExecuteComponent],
    exports: [
        RouterModule
    ]
})
export class ContractExecuteModule { }
