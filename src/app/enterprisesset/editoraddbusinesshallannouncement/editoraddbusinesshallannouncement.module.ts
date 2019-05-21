import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule,Routes }  from '@angular/router';
import { HeaderModule }  from '../../+common/header/header.module';


import { editoraddbusinesshallannouncement}  from './editoraddbusinesshallannouncement';

declare var $: any;

const editoraddbusinesshallannouncementRoute: Routes = [
  {path: ':id',component:editoraddbusinesshallannouncement},
];

@NgModule({
  imports:[
     CommonModule,
     HeaderModule, 
     FormsModule,

     RouterModule.forChild(editoraddbusinesshallannouncementRoute) ],
  declarations: [editoraddbusinesshallannouncement],
  
})
export class editoraddbusinesshallannouncementModule{

}