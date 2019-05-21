import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpersComponent } from './helpers.component';
import { AuthGuardService } from '../../+common/services/auth-guard.service';
import { CommonModule } from '@angular/common'

const routes: Routes = [
    { path: '', component: HelpersComponent, canActivate: [AuthGuardService] },
];

const routing = RouterModule.forChild(routes);

@NgModule({
    imports: [routing, CommonModule],
    declarations: [HelpersComponent]
})
export class HelpersModule { }