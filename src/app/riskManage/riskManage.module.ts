import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule } from '../+common/layout/layout.module';

import {Component} from '@angular/core';
declare var $:any;

@Component({
  selector: 'risk-manage',
  template: '<slidebar></slidebar><router-outlet></router-outlet>'
})
export class RiskManage {
	ngAfterViewInit(){
        $.showSide(10903);
        $.showMenu(1);
    }
}

const riskManageRoute: Routes = [
    {
        path: '',
        component: RiskManage,
        children: [
            {
                path:'bid',
                loadChildren: './biddingForecast/biddingForecast.module#RiskManageModule'
            }
        ]
    }
];
@NgModule({
    imports: [
        LayoutModule,
        RouterModule.forChild(riskManageRoute)
    ],
    declarations: [ RiskManage],
    exports: [
        RouterModule
    ]
})
export class RiskManageModule { }