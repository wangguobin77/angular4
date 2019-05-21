import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { RouterModule,Routes }  from '@angular/router';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { Detail}  from './detail';
import { ClientSale}  from './sale/sale.component';
import { Park}  from './park/park.component';
import { ClientContract}  from './contract/contract.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DetailService } from './detail.service';


import { DialogModule } from '@progress/kendo-angular-dialog';

import { FormsModule,ReactiveFormsModule} from '@angular/forms';
const detailRoute: Routes = [
    {
        path: '',
        component:Detail,
        children:[
            {
                path: 'park/:id',
                component:Park
            },
            {
                path: 'power/:id',
                loadChildren:'./power/power.module#ParkPowerModule'
            },
            {
                path: 'sale/:id',
                component:ClientSale
            },
            {
                path: 'contract/:id',
                component:ClientContract
            }
        ]
    }
];
@NgModule({
  imports:      [ CommonModule, FormsModule,InputsModule,GridModule,DropDownsModule,DialogModule,InputsModule,FormsModule,ReactiveFormsModule,RouterModule.forChild(detailRoute) ],
  declarations: [Detail, ClientSale, ClientContract, Park],
  exports: [
    RouterModule
  ],
  providers:[DetailService]
})
export class DetailModule{}