import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule,Routes }  from '@angular/router';
import { HeaderModule }  from '../../+common/header/header.module';
import { SideNavModule }  from '../sideNav/sideNav.module';

import { editenterpriseannouncement}  from './editenterpriseannouncement';


const editenterpriseannouncementRoute: Routes = [
  {path: ':id',component:editenterpriseannouncement},
];

@NgModule({
  imports:[
     CommonModule,
     HeaderModule, 
     FormsModule,
     SideNavModule,
     RouterModule.forChild(editenterpriseannouncementRoute) ],
  declarations: [editenterpriseannouncement],
  exports: [
    
  ],
  
})
export class editenterpriseannouncementModule{}