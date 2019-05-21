import { NgModule,OnInit  } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ExecuteCheck } from './check';
import { ShufflingModule }  from '../../../../+common/shuffling/shuffling.module';

const routes: Routes = [
    { path: '', component: ExecuteCheck },
];

const routing = RouterModule.forChild(routes);

@NgModule({
    imports: [routing,CommonModule,ShufflingModule],
    declarations: [ExecuteCheck]
})
export class CheckModule
{
    
}