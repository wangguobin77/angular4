import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskComponent } from './task.component';
import { AuthGuardService } from '../../+common/services/auth-guard.service';
import { CommonModule } from '@angular/common'

const routes: Routes = [
    { path: ':date', component: TaskComponent, canActivate: [AuthGuardService] },
];

const routing = RouterModule.forChild(routes);

@NgModule({
    imports: [routing, CommonModule],
    declarations: [TaskComponent]
})
export class TaskModule { }
