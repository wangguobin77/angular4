import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule } from '../+common/layout/layout.module';
import { Cilent } from './client';
const clientRoute: Routes = [
    {
        path: '',
        component: Cilent,
        children: [
            {
                path: 'anhui',
                loadChildren: './manage/anhui/anhui.module#ClientAnhuiModule'
            },
            {
                path: 'guangdong',
                loadChildren: './manage/guangdong/clientGuangdong.module#GuangdongModule'
            },
            {
                path: 'shanxi',
                loadChildren: './manage/shanxi/shanxi.module#ClientShanxiModule'
            },
            {
                path: 'park',
                loadChildren: './manage/park/park.module#ClientParkModule'
            },
            {
                path: 'Performance',
                loadChildren: './manage/Performance/performance.module#PerformanceModule'
            },
            {
                path: 'Performancegd',
                loadChildren: './manage/performancegd/performancegd.module#PerformancegdModule'
            },
            {
                path: 'Performancesx',
                loadChildren: './manage/performancesx/performancesx.module#PerformancesxModule'
            },
            {
                path: 'transfer',
                loadChildren: './manage/transferRecord/transfer.module#TransferRecordModule'
            },


        ]
    }
];
@NgModule({
    imports: [
        LayoutModule,
        RouterModule.forChild(clientRoute)
    ],
    declarations: [Cilent]
})
export class ClientModule { }