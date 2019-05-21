﻿import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';

import { GridModule } from '@progress/kendo-angular-grid';

import { Performance } from './performance';

import { DataService } from './performance.service';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';


const performanceRoute: Routes = [

    {

        path: '',

        component: Performance,

    }

];

@NgModule({

    imports: [

        CommonModule,

        FormsModule,

        GridModule,

        ReactiveFormsModule,

        DropDownsModule,

        RouterModule.forChild(performanceRoute)

    ],

    declarations: [Performance],

    exports: [

        RouterModule

    ],

    providers: [DataService]

})

export class PerformanceModule { }