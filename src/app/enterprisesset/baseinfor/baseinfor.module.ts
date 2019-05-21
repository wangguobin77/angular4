import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { baseinfor } from './baseinfor';

import { InputsModule } from '@progress/kendo-angular-inputs';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DialogModule } from '@progress/kendo-angular-dialog';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { UploadModule } from '@progress/kendo-angular-upload';

const baseinforRoute: Routes = [
	{ path: '', component: baseinfor },
];

declare var $: any;
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
		RouterModule.forChild(baseinforRoute)],
	declarations: [baseinfor],
})
export class baseinforModule { 

    ngOnInit() {
        $.showMenu(1);
    }
      ngAfterViewInit(){
        $.showSide(10401);
    }
   }
