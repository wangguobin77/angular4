import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule,Routes }  from '@angular/router';
import { HeaderModule }  from '../../+common/header/header.module';
import { SideNavModule }  from '../sideNav/sideNav.module';

import { newenterpriseannouncement}  from './newenterpriseannouncement';


const newenterpriseannouncementRoute: Routes = [
	{path: '',component:newenterpriseannouncement},
];

@NgModule({
  imports:[
  	 CommonModule,
  	 HeaderModule, 
  	 FormsModule,
  	 SideNavModule,
  	 RouterModule.forChild(newenterpriseannouncementRoute) ],
  declarations: [newenterpriseannouncement],
})
export class newenterpriseannouncementModule{}