﻿import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';

import { GridModule } from '@progress/kendo-angular-grid';

import { customersx } from './customersx';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { ChartsModule } from '@progress/kendo-angular-charts';




const customersxRoute: Routes = [

    {

        path: '',

        component: customersx,

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


        RouterModule.forChild(customersxRoute)

    ],

    declarations: [customersx],

    exports: [

        RouterModule

    ],


})

export class customersxModule { }