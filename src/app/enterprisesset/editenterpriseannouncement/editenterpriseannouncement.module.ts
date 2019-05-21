import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule,Routes }  from '@angular/router';
import { HeaderModule }  from '../../+common/header/header.module';


import { editenterpriseannouncement}  from './editenterpriseannouncement';


const editenterpriseannouncementRoute: Routes = [
  {path: ':id',component:editenterpriseannouncement},
];

@NgModule({
  imports:[
     CommonModule,
     FormsModule,
     RouterModule.forChild(editenterpriseannouncementRoute) ],
  declarations: [editenterpriseannouncement],
  
})
export class editenterpriseannouncementModule{}