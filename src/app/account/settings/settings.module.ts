import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { AuthGuardService } from '../../+common/services/auth-guard.service';
import { CommonModule } from '@angular/common'

const routes: Routes = [
    { path: '', component: SettingsComponent, canActivate: [AuthGuardService] },
];

const routing = RouterModule.forChild(routes);

@NgModule({
    imports: [routing, CommonModule],
    declarations: [SettingsComponent]
})
export class SettingsModule { }