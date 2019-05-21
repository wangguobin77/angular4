import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { KendoModule } from '../../+common/module/kendo.module'
import { AuthGuardService } from '../../+common/services/auth-guard.service';
import { OnlineComponent } from './online.component';
import { GridModule } from '@progress/kendo-angular-grid';
const routes: Routes = [
  { path: '', component: OnlineComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [
    CommonModule,
    GridModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OnlineComponent]
})
export class OnlineModule { }
