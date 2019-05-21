import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { RouterModule,Routes }  from '@angular/router';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { Detail}  from './detail';
import { ClientSale}  from './sale/sale.component';
import { Client}  from './client/client.component';
import { ClientContract}  from './contract/contract.component';
import { Record}  from './record/record';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DetailService } from './detail.service';
import {SaleService} from './sale/sale.service';
import {LogInfoService} from './sale/logInfo.service';
import {ClientService} from './client/client.service';
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
                path: 'client/:id',
                component:Client
            },
            {
                path: 'power/:id',
                loadChildren:'./power/anhuiClientPower.module#ClientPowerModule'
            },
            {
                path: 'sale/:id',
                component:ClientSale
            },
            {
                path: 'contract/:id',
                component:ClientContract
            },
            {
                path: 'record/:id',
                component:Record
            }
        ]
    }
];
@NgModule({
  imports:      [ CommonModule, FormsModule,ReactiveFormsModule,InputsModule,GridModule,UploadModule,DialogModule,DropDownsModule,RouterModule.forChild(detailRoute) ],
  declarations: [Detail,ClientSale,ClientContract,Client,Record],
  exports: [
    RouterModule
  ],
  providers:[DetailService,SaleService,LogInfoService,ClientService,PowerService,ContractService]
})
export class DetailModule{}