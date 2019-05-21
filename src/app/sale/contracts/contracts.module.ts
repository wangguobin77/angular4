import { NgModule, Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../+common/services/auth-guard.service';
import { LayoutModule } from '../../+common/layout/layout.module';

declare var $: any;

@Component({
    selector: 'contracts',
    template: '<slidebar></slidebar><router-outlet></router-outlet>'
})

export class ContractsComponent implements AfterViewInit, OnInit {
    ngOnInit() {
        $.showMenu(1);
    }
    ngAfterViewInit() {
        $.showSide(10501);
    }
}

const router: Routes = [
    {
        path: '',
        component: ContractsComponent,
        children: [
            {
                path: 'anhui/list',
                loadChildren: './anhui/list/list.module#ListModule'
            },
            {
                path: 'anhui/edit',
                loadChildren: './anhui/edit/edit.module#EditModule'
            },
            {
                path: 'anhui/detail',
                loadChildren: './anhui/detail/detail.module#DetailModule'
            },
            {
                path: 'anhui/history',
                loadChildren: './anhui/history/history.module#HistoryModule'
            },
            {
                path: 'anhui/create',
                loadChildren: './anhui/create/createcac.module#CreateModule'
            },
            {
                path: 'guangdong/create',
                loadChildren: './guangdong/create/createcac.module#CreateModule'
            },
            {
                path: 'guangdong/list',
                loadChildren: './guangdong/list/list.module#ListModule'
            },
            {
                path: 'guangdong/edit',
                loadChildren: './guangdong/edit/edit.module#EditModule'
            },
            {
                path: 'guangdong/detail',
                loadChildren: './guangdong/detail/detail.module#DetailModule'
            },
            {
                path: 'guangdong/history',
                loadChildren: './guangdong/history/history.module#HistoryModule'
            },
            {
                path: 'shanxi/create',
                loadChildren: './shanxi/create/createcac.module#CreateModule'
            },
            {
                path: 'shanxi/list',
                loadChildren: './shanxi/list/list.module#ListModule'
            },
            {
                path: 'shanxi/edit',
                loadChildren: './shanxi/edit/edit.module#EditModule'
            },
            {
                path: 'shanxi/detail',
                loadChildren: './shanxi/detail/detail.module#DetailModule'
            },
            {
                path: 'shanxi/history',
                loadChildren: './shanxi/history/history.module#HistoryModule'
            },
            {
                path: 'anhui/create_package',
                loadChildren: './anhui/create_package/createcacp.module#CreateModule'
            },
            {
                path: 'guangdong/create_package',
                loadChildren: './guangdong/create_package/createcacp.module#CreateModule'
            },
            {
                path: 'shanxi/create_package',
                loadChildren: './shanxi/create_package/createcacp.module#CreateModule'
            }
        ]
    }
];

@NgModule({
    imports: [
        LayoutModule,
        RouterModule.forChild(router)
    ],
    declarations: [ContractsComponent],
    exports: [
        RouterModule
    ]
})
export class ContractsModule { }
