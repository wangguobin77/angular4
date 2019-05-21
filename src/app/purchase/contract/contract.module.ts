import { NgModule, Component,OnInit }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../+common/services/auth-guard.service';
import { LayoutModule } from '../../+common/layout/layout.module';
import { ContractList } from './anhui/list/list.component';
import { ContractCreate } from './anhui/create/create';
import { ContractEdit } from './anhui/edit/edit';
import { ContractDetail } from './anhui/detail/detail.component';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DataService } from './anhui/list/list.service';
import { GridModule } from '@progress/kendo-angular-grid';
import { GDContractList } from './guangdong/list/list.component';
import { GDContractCreate } from './guangdong/create/create';
import { GDContractEdit } from './guangdong/edit/edit';
import { GDContractDetail } from './guangdong/detail/detail.component';
import { GDDataService } from './guangdong/list/list.service';
import { ShufflingModule }  from '../../+common/shuffling/shuffling.module';
declare var $:any;
@Component({
    selector: 'contract',
    template: '<slidebar></slidebar><router-outlet></router-outlet>'
})
export class ContractComponent {
    ngAfterViewInit(){
        $.showSide(10603);
    }
}

const router: Routes = [
    {
        path: '',
        component: ContractComponent,
        children: [
        	{
        		path: 'anhui/list',
        		component: ContractList
        	},
        	{
        		path: 'anhui/create/:id',
        		component: ContractCreate
        	},
            {
                path: 'anhui/detail/:id',
                component: ContractDetail
            },
            {
                path: 'anhui/edit/:id',
                component: ContractEdit
            },
            {
        		path: 'guangdong/list',
        		component: GDContractList
        	},
        	{
        		path: 'guangdong/create/:id',
        		component: GDContractCreate
        	},
            {
                path: 'guangdong/detail/:id',
                component: GDContractDetail
            },
            {
                path: 'guangdong/edit/:id',
                component: GDContractEdit
            },
        ]
    }
];

@NgModule({
    imports: [ 
        LayoutModule,
        InputsModule,
        GridModule,
        FormsModule,
        CommonModule,
        DateInputsModule,
        ReactiveFormsModule,
        DropDownsModule,
        ShufflingModule,
        RouterModule.forChild(router) 
    ],
    declarations: [ContractComponent,ContractList,ContractCreate,ContractDetail,ContractEdit,GDContractList,GDContractCreate,GDContractDetail,GDContractEdit],
    exports: [
        RouterModule
    ],
    providers: [DataService,GDDataService]
})
export class PurchaseContractModule{ 
}