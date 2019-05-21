import { NgModule } from '@angular/core';

import { DialogModule } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule,DatePickerModule } from '@progress/kendo-angular-dateinputs';
import { BaseModule } from './base.module'


@NgModule({
    imports: [],
    declarations: [],
    exports: [DialogModule, GridModule, InputsModule, DropDownsModule,DateInputsModule,DatePickerModule, BaseModule]
})

export class KendoModule { }