import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule,Routes }  from '@angular/router';
import { HeaderModule }  from '../../+common/header/header.module';


import { detailenter}  from './detailenter';


const detailenterRoute: Routes = [
  {path: ':id',component:detailenter},
];

@NgModule({
  imports:[
     CommonModule,
     HeaderModule, 
     FormsModule,

     RouterModule.forChild(detailenterRoute) ],
  declarations: [detailenter],

})
export class detailenterModule{}