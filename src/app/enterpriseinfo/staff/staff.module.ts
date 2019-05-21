import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule,ReactiveFormsModule }        from '@angular/forms';
import { RouterModule,Routes }  from '@angular/router';

import { HeaderModule }  from '../../+common/header/header.module';

import { SideNavModule }  from '../sideNav/sideNav.module';

import { staff}  from './staff';
import { HttpModule } from '@angular/http';
import { DialogModule } from '@progress/kendo-angular-dialog';

import { InputsModule } from '@progress/kendo-angular-inputs';
import { GridModule } from '@progress/kendo-angular-grid';
import { AuthGuardService } from '../../+common/services/auth-guard.service';


const staffRoute: Routes =[
    { path: '', component:staff},
];

@NgModule({
	imports: [
		SideNavModule,
		CommonModule, 
		DialogModule, 
		InputsModule, 
		FormsModule, 
		ReactiveFormsModule,
		RouterModule.forChild(staffRoute)
	],
	declarations: [staff],
	
})

export class StaffModule{}


