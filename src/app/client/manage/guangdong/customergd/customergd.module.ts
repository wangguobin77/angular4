﻿import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';

import { GridModule } from '@progress/kendo-angular-grid';

import { customergd } from './customergd';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { ChartsModule } from '@progress/kendo-angular-charts';




const customergdRoute: Routes = [

    {

        path: '',

        component: customergd,

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


        RouterModule.forChild(customergdRoute)

    ],

    declarations: [customergd],

    exports: [

        RouterModule

    ],


})

export class customergdModule { }