import { NgModule ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';


import { DialogModule } from '@progress/kendo-angular-dialog';

import { InputsModule } from '@progress/kendo-angular-inputs';

import { FormsModule,ReactiveFormsModule} from '@angular/forms';

import { staffmanagement } from './staffmanagement';

declare var $: any;

const staffmanagementRoute: Routes = [
	{ path: '', component: staffmanagement },
];

@NgModule({
	imports: [
		CommonModule, 
		DialogModule, 
		InputsModule, 
		FormsModule, 
		ReactiveFormsModule,
		RouterModule.forChild(staffmanagementRoute)
	],
	declarations: [staffmanagement],
	
})

export class staffmanagementModule { 
	 ngOnInit() {
        $.showMenu(1);
    }
    ngAfterViewInit(){
        $.showSide(11001);
    }
 } 