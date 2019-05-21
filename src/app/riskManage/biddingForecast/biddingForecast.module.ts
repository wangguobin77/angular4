import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {List} from './list/list';
import {Create} from './create/create';
import {Detail} from './detail/detail';
import { DataService } from './list/list.service';
import { AuthGuardService } from '../../+common/services/auth-guard.service';

import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { IntlModule } from '@progress/kendo-angular-intl';
import { ChartsModule } from '@progress/kendo-angular-charts';

const bidRoute: Routes = [
    {
        path: '',
        component: List
    },
    {
        path: 'create',
        component: Create
    },
    {
        path: 'detail',
        component: Detail
    }
];


@NgModule({
    imports: [
        GridModule,
        FormsModule,
        DateInputsModule,
        DialogModule,
        CommonModule,
        IntlModule,
        InputsModule,
        DropDownsModule,
        ChartsModule,
        RouterModule.forChild(bidRoute)
    ],
    declarations: [List,Create,Detail],
    exports: [
        RouterModule
    ],
    providers:[DataService,AuthGuardService]
})
export class RiskManageModule { }