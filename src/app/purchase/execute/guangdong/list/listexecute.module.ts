import { NgModule,OnInit  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list.component';

const routes: Routes = [
    { path: '', component: ListComponent },
];

const routing = RouterModule.forChild(routes);

@NgModule({
    imports: [routing],
    declarations: [ListComponent]
})
export class ListModule
{
    
}