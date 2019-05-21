﻿import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';

import { GridModule } from '@progress/kendo-angular-grid';

import { customer } from './customer';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { ChartsModule } from '@progress/kendo-angular-charts';




const customerRoute: Routes = [

    {

        path: '',

        component: customer,

    }

];

@NgModule({

    imports: [

        CommonModule,

        FormsModule,

        GridModule,

        ReactiveFormsModule,

        DropDownsModule,

        ChartsModule,


        RouterModule.forChild(customerRoute)

    ],

    declarations: [customer],

    exports: [

        RouterModule

    ],


})

export class customerModule { }