import { NgModule, Component,OnInit }   from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from '../../+common/services/auth-guard.service';
import { LayoutModule } from '../../+common/layout/layout.module';
declare var $:any;
@Component({
    selector: 'execute',
    template: '<slidebar></slidebar><router-outlet></router-outlet>'
})
export class ExecuteComponent {
    ngAfterViewInit(){
        $.showSide(10602);
    }
}

const router: Routes = [
    {
        path: '',
        component: ExecuteComponent,
        children: [
            {
                path: 'anhui/list',
                loadChildren: './anhui/list/listexecute.module#ListModule',
            },
            {
                path: 'anhui/detail/:id',
                loadChildren: './anhui/detail/detailexecute.module#DetailModule',
            },
            {
                path: 'anhui/check/:id',
                loadChildren: './anhui/check/check.module#CheckModule',
            },
            {
                path: 'anhui/bid-detail/:id',
                loadChildren: './anhui/bidDetail/bidDetailexecute.module#BidDetailModule',
            },
            {
                path: 'anhui/bid-check/:id',
                loadChildren: './anhui/bidCheck/bidCheck.module#BidCheckModule',
            },
            {
                path: 'guangdong/list',
                loadChildren: './guangdong/list/listexecute.module#ListModule',
            },
            {
                path: 'guangdong/detail/:id',
                loadChildren: './guangdong/detail/detailexecute.module#DetailModule',
            },
            {
                path: 'guangdong/check/:id',
                loadChildren: './guangdong/check/check.module#CheckModule',
            },
            {
                path: 'guangdong/bid-detail/:id',
                loadChildren: './guangdong/bidDetail/bidDetailexecute.module#BidDetailModule',
            },
            {
                path: 'guangdong/bid-check/:id',
                loadChildren: './guangdong/bidCheck/bidCheck.module#BidCheckModule',
            },
            {
                path: 'shanxi/list',
                loadChildren: './shanxi/list/listexecute.module#ListModule',
            },
            {
                path: 'shanxi/bid-detail/:id',
                loadChildren: './shanxi/bidDetail/bidDetailexecute.module#BidDetailModule',
            },
            {
                path: 'shanxi/bid-check/:id',
                loadChildren: './shanxi/bidCheck/bidCheck.module#BidCheckModule',
            },
        ]
    }
];

@NgModule({
    imports: [ 
        LayoutModule,
        RouterModule.forChild(router) 
    ],
    declarations: [ExecuteComponent],
    exports: [
        RouterModule
    ]
})
export class ExecuteModule{ }