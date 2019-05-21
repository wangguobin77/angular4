import { NgModule, Component,OnInit }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from '../../+common/services/auth-guard.service';
import { LayoutModule } from '../../+common/layout/layout.module';

declare var $: any;

@Component({
    selector: 'plan',
    template: '<slidebar></slidebar><router-outlet></router-outlet>'
})
export class PlanComponent {
    ngAfterViewInit(){
        $.showSide(10601);
    }
}

const router: Routes = [
    {
        path: '',
        component: PlanComponent,
        children: [
            {
                path: 'anhui/list',
                loadChildren: './anhui/list/listplan.module#ListModule',
            },
            {
                path: 'anhui/detail/:id',
                loadChildren: './anhui/detail/detailplan.module#DetailModule',
            },
            {
                path: 'anhui/create',
                loadChildren: './anhui/create/createplan.module#CreateModule',
            },
            {
                path: 'guangdong/list',
                loadChildren: './guangdong/list/listplan.module#ListModule',
            },
            {
                path: 'guangdong/detail/:id',
                loadChildren: './guangdong/detail/detailplan.module#DetailModule',
            },
            {
                path: 'guangdong/create',
                loadChildren: './guangdong/create/createplan.module#CreateModule',
            },
            {
                path: 'shanxi/list',
                loadChildren: './shanxi/list/listplan.module#ListModule',
            },
            {
                path: 'shanxi/detail/:id',
                loadChildren: './shanxi/detail/detailplan.module#DetailModule',
            },
            {
                path: 'shanxi/create',
                loadChildren: './shanxi/create/createplan.module#CreateModule',
            },
        ]
    }
];

@NgModule({
    imports: [ 
        LayoutModule,
        RouterModule.forChild(router) 
    ],
    declarations: [PlanComponent],
    exports: [
        RouterModule
    ]
})
export class PlanModule{ }