import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { SideNavModule } from '../sideNav/sideNav.module';

import { DialogModule } from '@progress/kendo-angular-dialog';

import { InputsModule } from '@progress/kendo-angular-inputs';

import { FormsModule,ReactiveFormsModule} from '@angular/forms';

import { staffmanage } from './staffmanage';

const staffmanageRoute: Routes = [
	{ path: '', component: staffmanage },
];

@NgModule({
	imports: [
		SideNavModule,
		CommonModule, 
		DialogModule, 
		InputsModule, 
		FormsModule, 
		ReactiveFormsModule,
		RouterModule.forChild(staffmanageRoute)
	],
	declarations: [staffmanage],
	
})

export class staffmanageModule { } 