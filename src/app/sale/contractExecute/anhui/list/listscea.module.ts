import { NgModule, OnInit  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list.component';

import { AuthGuardService } from '../../../../+common/services/auth-guard.service';


import { CommonModule } from '@angular/common';

import { HttpModule } from '@angular/http';
import { GridModule } from '@progress/kendo-angular-grid';


const routes: Routes = [
    { path: '', component: ListComponent, canActivate: [AuthGuardService] },
];

const routing = RouterModule.forChild(routes);


@NgModule({
    imports: [routing, CommonModule,  GridModule, HttpModule],
    declarations: [ListComponent],
    providers: []
})
export class ListModule
{
    
}