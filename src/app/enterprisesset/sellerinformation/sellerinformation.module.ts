import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { sellerinformation } from './sellerinformation';

import { InputsModule } from '@progress/kendo-angular-inputs';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DialogModule } from '@progress/kendo-angular-dialog';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { UploadModule } from '@progress/kendo-angular-upload';
const sellerinformationRoute: Routes = [
 { path: '', component: sellerinformation },
];

@NgModule({
    imports: [
        UploadModule,
		CommonModule,
		FormsModule,
		DialogModule,
		InputsModule,
		FormsModule,
		ReactiveFormsModule,
		DropDownsModule,
	 	RouterModule.forChild(sellerinformationRoute)
	 ],
		declarations: [sellerinformation],
})
export class sellerinformationModule { }

