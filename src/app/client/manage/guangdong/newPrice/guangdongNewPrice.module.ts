import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NewPriceService } from './list/list.service';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DialogModule } from '@progress/kendo-angular-dialog';

import { List } from './list/list.component';
import { Result } from './result/result.component';
const anhuiRoute: Routes = [
    {
        path: 'list/:id',
        component: List
    },
    {
        path: 'result/:id',
        component: Result
    }
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        GridModule,
        DropDownsModule,
        InputsModule,
        DialogModule,
        ReactiveFormsModule,
        RouterModule.forChild(anhuiRoute)
    ],
    declarations: [List,Result],
    exports: [
        RouterModule
    ],
    providers: [NewPriceService]
})
export class GuangdongNewPriceModule { }