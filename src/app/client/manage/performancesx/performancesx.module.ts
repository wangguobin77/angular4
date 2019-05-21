﻿import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';

import { GridModule } from '@progress/kendo-angular-grid';

import { Performancesx } from './performancesx';

import { DataService } from './performancesx.service';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';


const performancesxRoute: Routes = [

    {

        path: '',

        component: Performancesx,

    }

];

@NgModule({

    imports: [

        CommonModule,

        FormsModule,

        GridModule,

        ReactiveFormsModule,

        DropDownsModule,

        RouterModule.forChild(performancesxRoute)

    ],

    declarations: [Performancesx],

    exports: [

        RouterModule

    ],

    providers: [DataService]

})

export class PerformancesxModule { }