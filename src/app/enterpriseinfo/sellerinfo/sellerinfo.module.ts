import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BaseModule } from '../../+common/module/base.module';
import { sellerinfo } from './sellerinfo';
import { ShufflingModule }  from '../../+common/shuffling/shuffling.module';

const sellerinfoRoute: Routes = [
	{ path: '', component: sellerinfo },
];

@NgModule({
	imports: [
		BaseModule,
		ShufflingModule,
		RouterModule.forChild(sellerinfoRoute)],
	declarations: [sellerinfo]
})
export class sellerinfoModule { }
