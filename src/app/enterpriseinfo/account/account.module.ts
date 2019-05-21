import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../../+common/header/header.module';
import { SideNavModule } from '../sideNav/sideNav.module';
import { account } from './account';


const accountRoute: Routes = [
  { path: '', component: account },
];

@NgModule({
  imports: [
    CommonModule,
    HeaderModule,
    FormsModule,
    SideNavModule,
    RouterModule.forChild(accountRoute)],
  declarations: [account],
 
})
export class accountModule { }