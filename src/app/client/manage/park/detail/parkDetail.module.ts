import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { RouterModule,Routes }  from '@angular/router';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { Detail}  from './detail';
import { ParkSale}  from './sale/sale.component';
import { Park}  from './park/park.component';
import { ParkContract}  from './contract/contract.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DetailService } from './detail.service';
import {SaleService} from './sale/sale.service';
import {LogInfoService} from './sale/logInfo.service';
import { ClientService } from './park/park.service';
import { ParkClientService } from './park/parkcustomer.service';
import {ContractService} from './contract/contract.service';
import {PowerService} from './power/power.service';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { UploadModule } from '@progress/kendo-angular-upload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
                loadChildren:'./power/parkClientPower.module#ClientPowerModule'
            },
            {
                path: 'sale/:id',
                component:ParkSale
            },
            {
                path: 'contract/:id',
                component:ParkContract
            }
        ]
    }
];
@NgModule({
  imports:      [ CommonModule, FormsModule,ReactiveFormsModule,InputsModule,GridModule,UploadModule,DialogModule,DropDownsModule,RouterModule.forChild(detailRoute) ],
  declarations: [Detail,ParkSale,ParkContract,Park],
  exports: [
    RouterModule
  ],
  providers: [DetailService, SaleService, LogInfoService, ClientService, PowerService, ContractService, ParkClientService]
})
export class DetailModule{}