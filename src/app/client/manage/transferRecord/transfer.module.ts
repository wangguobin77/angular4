import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GridModule } from '@progress/kendo-angular-grid';
import { ClientTransferRecordService } from './clientTransferRecord.service';
import {TransferRecord} from './transferRecord';

const transferRoute: Routes = [
    {
        path: '',
        component: TransferRecord,
    }
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        GridModule,
        ReactiveFormsModule,
        RouterModule.forChild(transferRoute)
    ],
    declarations: [TransferRecord],
    exports: [
        RouterModule
    ],
    providers: [ClientTransferRecordService]
})
export class TransferRecordModule { }