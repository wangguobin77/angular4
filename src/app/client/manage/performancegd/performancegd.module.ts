﻿import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';

import { GridModule } from '@progress/kendo-angular-grid';

import { Performancegd } from './performancegd';

import { DataService } from './performancegd.service';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';


const performancegdRoute: Routes = [

    {

        path: '',

        component: Performancegd,

    }

];

@NgModule({

    imports: [

        CommonModule,

        FormsModule,

        GridModule,

        ReactiveFormsModule,

        DropDownsModule,

        RouterModule.forChild(performancegdRoute)

    ],

    declarations: [Performancegd],

    exports: [

        RouterModule

    ],

    providers: [DataService]

})

export class PerformancegdModule { }