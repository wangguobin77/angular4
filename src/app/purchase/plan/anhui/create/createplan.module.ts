import { NgModule,OnInit  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule, } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { CreateComponent } from './create.component';
import { SelectContract } from './selectContract/selectContract';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import {NgClass} from '@angular/common';
import { GridModule } from '@progress/kendo-angular-grid';
import {SelectContractService} from './selectContract/select.service'
import { DialogModule } from '@progress/kendo-angular-dialog';
const routes: Routes = [
    { path: '', component: CreateComponent },
    { path: 'selectContract', component: SelectContract }
];

const routing = RouterModule.forChild(routes);

@NgModule({
    imports: [FormsModule,ReactiveFormsModule,DialogModule,GridModule,CommonModule,InputsModule,DropDownsModule,DateInputsModule,routing],
    declarations: [CreateComponent,SelectContract],
    providers:[SelectContractService]
})
export class CreateModule
{
    
}