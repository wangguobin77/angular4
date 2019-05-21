import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule,Routes }  from '@angular/router';
import { HeaderModule }  from '../+common/header/header.module';
import { clientList }  from './clientManage/clientList/clientList';

const serviceRoute: Routes = [
	{path: '',component:clientList},
];

@NgModule({
  imports:      [ CommonModule, FormsModule,HeaderModule,RouterModule.forChild(serviceRoute) ],
  declarations: [clientList],
  exports: [
    RouterModule
  ]
})
export class serviceModule{}