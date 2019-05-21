import { NgModule, Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../+common/services/auth-guard.service';
import { LayoutModule } from '../../+common/layout/layout.module';

declare var $: any;

@Component({
    selector: 'performance',
    template: '<slidebar></slidebar><router-outlet></router-outlet>'
})

export class PerformanceComponent implements AfterViewInit, OnInit {
    ngOnInit() {
        $.showMenu(1);
    }
    ngAfterViewInit() {
        $.showSide(10201);
    }
}

const router: Routes = [
    {
        path: '',
        component: PerformanceComponent,
        children: [
            {
                path: 'anhui/list',
                loadChildren: './anhui/list/listpa.module#AHListModule'
            },
            {
                path: 'anhui/detail',
                loadChildren: './anhui/detail/detailpa.module#AHDetailModule'
            },
            {
                path: 'guangdong/list',
                loadChildren: './guangdong/list/listpa.module#GDListModule'
            },
            {
                path: 'guangdong/detail',
                loadChildren: './guangdong/detail/detailpa.module#GDDetailModule'
            },
            {
                path: 'shanxi/list',
                loadChildren: './shanxi/list/listpa.module#SXListModule'
            },
            {
                path: 'shanxi/detail',
                loadChildren: './shanxi/detail/detailpa.module#SXDetailModule'
            },
        ]
    }
];

@NgModule({
    imports: [
        LayoutModule,
        RouterModule.forChild(router)
    ],
    declarations: [PerformanceComponent],
    
})
export class PerformanceModule { }
