import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { KendoModule } from '../../+common/module/kendo.module'
import { AuthGuardService } from '../../+common/services/auth-guard.service';
import { AnalyzeComponent } from './analyze.component';

const routes: Routes = [
    { path: '', component: AnalyzeComponent, canActivate: [AuthGuardService] },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AnalyzeComponent]
})
export class AnalyzeModule { }

