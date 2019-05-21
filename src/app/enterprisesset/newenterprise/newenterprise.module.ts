import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule,Routes }  from '@angular/router';
import { HeaderModule }  from '../../+common/header/header.module';


import { newenterprise}  from './newenterprise';

const newenterpriseRoute: Routes = [
	{path: '',component:newenterprise},
];

@NgModule({
  imports:[
  	 CommonModule,
  	 HeaderModule, 
  	 FormsModule,
  	 RouterModule.forChild(newenterpriseRoute) ],
  declarations: [newenterprise],
  
})
export class newenterpriseModule{}