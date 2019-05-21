import { NgModule, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { KendoModule } from '../../+common/module/kendo.module'
import { AuthGuardService } from '../../+common/services/auth-guard.service';

import { ServiceComponent } from './service.component';

const routes: Routes = [
  { path: '', component: ServiceComponent, canActivate: [AuthGuardService] },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ServiceComponent]
})
export class ServiceModule { }
