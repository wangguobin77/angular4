import { NgModule,OnInit  } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { DetailComponent } from './detail.component';

const routes: Routes = [
    { path: '', component: DetailComponent },
];

const routing = RouterModule.forChild(routes);

@NgModule({
    imports: [routing,CommonModule],
    declarations: [DetailComponent]
})
export class DetailModule
{
    
}