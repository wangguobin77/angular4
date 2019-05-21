import { NgModule }           from '@angular/core';

import { CommonModule }       from '@angular/common';

import { RouterModule,Routes }  from '@angular/router';

import { HeaderModule }  from '../../+common/header/header.module';



import { DialogModule } from '@progress/kendo-angular-dialog';

import { InputsModule } from '@progress/kendo-angular-inputs';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { businesshallannouncement}  from './businesshallannouncement';

declare var $: any;

const businesshallannouncementRoute: Routes = [
	{path: '',component:businesshallannouncement},
];

@NgModule({
  imports:[
  	CommonModule,
  	HeaderModule, 
    InputsModule,
    FormsModule, 
    DialogModule, 
    ReactiveFormsModule,
  	RouterModule.forChild(businesshallannouncementRoute) ],
  declarations: [businesshallannouncement],

})
export class businesshallannouncementModule{
  
    ngOnInit() {
        $.showMenu(1);
    }
      ngAfterViewInit(){
        $.showSide(10402);
    }
}