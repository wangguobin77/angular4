import { NgModule,OnInit  } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GridModule } from '@progress/kendo-angular-grid';
import { ExecuteCheck } from './check';
import { ShufflingModule }  from '../../../../+common/shuffling/shuffling.module';
const routes: Routes = [
    { path: '', component: ExecuteCheck },
];

const routing = RouterModule.forChild(routes);

@NgModule({
    imports: [routing,CommonModule,GridModule,ShufflingModule],
    declarations: [ExecuteCheck]
})
export class BidCheckModule
{
    
}