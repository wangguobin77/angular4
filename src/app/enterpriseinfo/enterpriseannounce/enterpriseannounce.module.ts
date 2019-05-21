import { NgModule }           from '@angular/core';

import { CommonModule }       from '@angular/common';

import { RouterModule,Routes }  from '@angular/router';

import { HeaderModule }  from '../../+common/header/header.module';

import { SideNavModule } from '../sideNav/sideNav.module';

import { DialogModule } from '@progress/kendo-angular-dialog';

import { InputsModule } from '@progress/kendo-angular-inputs';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { enterpriseannounce}  from './enterpriseannounce';


const enterpriseannounceRoute: Routes = [
	{path: '',component:enterpriseannounce},
];

@NgModule({
  imports:[
  	CommonModule,
  	HeaderModule, 
    InputsModule,
    FormsModule, 
    DialogModule, 
    SideNavModule,
    ReactiveFormsModule,
  	RouterModule.forChild(enterpriseannounceRoute) ],
  declarations: [enterpriseannounce],

})
export class enterpriseannounceModule{}