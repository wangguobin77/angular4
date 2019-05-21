import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule,Routes }  from '@angular/router';
import { HeaderModule }  from '../../+common/header/header.module';


import { newhallannouncement}  from './newhallannouncement';


const newhallannouncementRoute: Routes = [
	{path: '',component:newhallannouncement},
];

@NgModule({
  imports:[
  	 CommonModule,
  	 HeaderModule, 
  	 FormsModule,

  	 RouterModule.forChild(newhallannouncementRoute) ],
  declarations: [newhallannouncement],
})
export class newhallannouncementModule{}