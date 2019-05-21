import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TradingCenterComponent } from './tradingCenter';
import { HeaderModule } from '../../+common/header/header.module';
import { SideNavModule } from '../sideNav/sideNav.module';

const orderRecordRoute: Routes = [
  { path: '', component: TradingCenterComponent },
];

@NgModule({
  imports: [CommonModule, FormsModule, HeaderModule, SideNavModule, RouterModule.forChild(orderRecordRoute)],
  declarations: [TradingCenterComponent],
  exports: [
    RouterModule
  ]
})
export class TradingCenterModule { }
