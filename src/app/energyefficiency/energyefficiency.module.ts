import { NgModule, Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../+common/services/auth-guard.service';
import { LayoutModule } from '../+common/layout/layout.module';

declare var $: any;

@Component({
  selector: 'app-energyefficiency',
  template: '<slidebar></slidebar><router-outlet></router-outlet>'
})

export class EnergyEfficiencyComponent implements AfterViewInit, OnInit {
  ngOnInit() {
  }
  ngAfterViewInit() {
    $.showMenu(1);
    $.showSide(10801);
  }
}

const router: Routes = [
  {
    path: '',
    component: EnergyEfficiencyComponent,
    children: [{
      path: 'online',
      loadChildren: './online/online.module#OnlineModule',
      canActivate: [AuthGuardService]
    }, {
      path: 'analyze',
      loadChildren: './analyze/analyze.module#AnalyzeModule',
      canActivate: [AuthGuardService]
    }, {
      path: 'basicforecasting',
      loadChildren: './basicforecasting/basicforecasting.module#BasicForecastingModule',
      canActivate: [AuthGuardService]
    }, {
      path: 'advforecasting',
      loadChildren: './advforecasting/advforecasting.module#AdvancedForecastingModule',
      canActivate: [AuthGuardService]
    }, {
      path: 'departureprewarning',
      loadChildren: './departureprewarning/departureprewarning.module#DeparturePrewarningModule',
      canActivate: [AuthGuardService]
    }, {
      path: 'service',
      loadChildren: './service/service.module#ServiceModule',
      canActivate: [AuthGuardService]
    }
    ]
  }
];

@NgModule({
  imports: [
    LayoutModule,
    RouterModule.forChild(router)
  ],
  declarations: [EnergyEfficiencyComponent],
  exports: [
    RouterModule
  ]
})

export class EnergyEfficiencyModule { }
