import { NgModule }           from '@angular/core';

import { CommonModule }       from '@angular/common';

import { RouterModule,Routes }  from '@angular/router';

import { HeaderModule }  from '../../+common/header/header.module';


import { DialogModule } from '@progress/kendo-angular-dialog';

import { InputsModule } from '@progress/kendo-angular-inputs';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { enterpriseannouncement}  from './enterpriseannouncement';


const enterpriseannouncementRoute: Routes = [
	{path: '',component:enterpriseannouncement},
];

@NgModule({
  imports:[
  	CommonModule,
  	HeaderModule, 
    InputsModule,
    FormsModule, 
    DialogModule, 
    ReactiveFormsModule,
  	RouterModule.forChild(enterpriseannouncementRoute) ],
  declarations: [enterpriseannouncement],

})
export class enterpriseannouncementModule{}