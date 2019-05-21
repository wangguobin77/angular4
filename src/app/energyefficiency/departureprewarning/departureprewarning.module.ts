import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { KendoModule } from '../../+common/module/kendo.module'
import { AuthGuardService } from '../../+common/services/auth-guard.service';
import { DeparturePrewarningComponent } from './departureprewarning.component';

const routes: Routes = [
    { path: '', component: DeparturePrewarningComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DeparturePrewarningComponent]
})
export class DeparturePrewarningModule { }
