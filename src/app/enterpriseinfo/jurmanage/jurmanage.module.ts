import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule,Routes }  from '@angular/router';
import { HeaderModule }  from '../../+common/header/header.module';
import { SideNavModule }  from '../sideNav/sideNav.module';

import { jurmanage}  from './jurmanage';


const jurmanageRoute: Routes = [
	{path: '',component:jurmanage},
];

@NgModule({
  imports:[
  	 CommonModule,
  	 HeaderModule, 
  	 FormsModule,
  	 SideNavModule,
  	 RouterModule.forChild(jurmanageRoute) ],
  declarations: [jurmanage],
})
export class jurmanageModule{}