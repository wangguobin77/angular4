import { NgModule, Component,OnInit }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
declare var $:any;

import { AuthGuardService } from '../../+common/services/auth-guard.service';
import { LayoutModule } from '../../+common/layout/layout.module';
import { ElectricityFactoryList } from './anhui/list/list.component';
import { ElectricityFactoryListDetailCreate } from './anhui/create/create';
import { ElectricityFactoryDetail } from './anhui/detail/detail.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GridModule } from '@progress/kendo-angular-grid';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DataService } from './anhui/list/list.service';

import { DialogModule } from '@progress/kendo-angular-dialog';

declare var $: any;
@Component({
    selector: 'electricityFactory',
    template: '<slidebar></slidebar><router-outlet></router-outlet>'
})
export class ElectricityFactoryComponent {
    ngAfterViewInit(){
        $.showSide(10604);
    }
}

const router: Routes = [
    {
        path: '',
        component: ElectricityFactoryComponent,
        children: [
        	{
        		path: 'list',
        		component: ElectricityFactoryList
        	},
        	{
        		path: 'create',
        		component: ElectricityFactoryListDetailCreate
        	},
            {
                path: 'detail/:id',
                component: ElectricityFactoryDetail
            }
        ]
    }
];

@NgModule({
    imports: [ 
        LayoutModule,
        InputsModule,
        FormsModule,
        CommonModule,
        GridModule,
        DialogModule,
        DateInputsModule,
        ReactiveFormsModule,
        DropDownsModule,
        GridModule,
        RouterModule.forChild(router) 
    ],
    declarations: [ElectricityFactoryComponent,ElectricityFactoryList,ElectricityFactoryListDetailCreate,ElectricityFactoryDetail],
    exports: [
        RouterModule
    ],
    providers: [DataService]
})
export class PurchaseElectricityFactoryModule{ 
}