import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { KendoModule } from '../../+common/module/kendo.module'
import { AuthGuardService } from '../../+common/services/auth-guard.service';
import { AdvForecastingComponent } from './advforecasting.component';

const routes: Routes = [
    { path: '', component: AdvForecastingComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdvForecastingComponent]
})
export class AdvancedForecastingModule { }
