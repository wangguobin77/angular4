import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../../+common/header/header.module';

import { accountsecurity } from './accountsecurity';                         
declare var $: any;


const accountsecurityRoute: Routes = [
  { path: '', component: accountsecurity },
];


@NgModule({
  imports: [

    CommonModule,
    HeaderModule,
    FormsModule,
    RouterModule.forChild(accountsecurityRoute)],
  declarations: [accountsecurity],
 
})

export class accountsecurityModule { 
	  ngOnInit() {
        $.showMenu(1);
    }
    	ngAfterViewInit(){
        $.showSide(10502);
    }
  }








