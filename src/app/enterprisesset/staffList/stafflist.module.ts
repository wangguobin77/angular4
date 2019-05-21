import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule,ReactiveFormsModule }        from '@angular/forms';
import { RouterModule,Routes }  from '@angular/router';

import { HeaderModule }  from '../../+common/header/header.module';


import { stafflist}  from './stafflist';
import { HttpModule } from '@angular/http';
import { DialogModule } from '@progress/kendo-angular-dialog';

import { InputsModule } from '@progress/kendo-angular-inputs';
import { GridModule } from '@progress/kendo-angular-grid';
import { AuthGuardService } from '../../+common/services/auth-guard.service';

import { KendoModule } from '../../+common/module/kendo.module'


const stafflistRoute: Routes =[
    { path: '', component:stafflist},
];

@NgModule({
	imports: [
		KendoModule,
		RouterModule.forChild(stafflistRoute)
	],
	declarations: [stafflist],
	
})

export class StafflistModule{}


