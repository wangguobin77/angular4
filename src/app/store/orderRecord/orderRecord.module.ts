import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { OrderRecord } from './orderRecord';
import { OrderDetail } from './orderDetail/orderDetail';
import { HeaderModule } from '../../+common/header/header.module';
import { SideNavModule } from '../sideNav/sideNav.module';
import { OrderRecordService } from './orderRecord.service';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';

const orderRecordRoute: Routes = [
	{ path: '', component: OrderRecord },
	{ path: 'detail/:id', component: OrderDetail },
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		HeaderModule,
		SideNavModule,
		GridModule,
		DialogModule,
		RouterModule.forChild(orderRecordRoute)
	],
	declarations: [OrderRecord, OrderDetail],
	exports: [
		RouterModule
	],
	providers: [OrderRecordService]
})
export class OrderRecordModule { }