import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../../+common/header/header.module';
import { LoadingModule } from '../../+common/loading/loading.module';
import { SideNavModule } from '../sideNav/sideNav.module';
import { ShufflingModule } from '../../+common/shuffling/shuffling.module';
import { AppStoreComponent } from './appStore';
import { AppStoreDetail } from './detail/detail.component';
import { SaleTool } from './saleTool/saleTool';
import { BasicPackage } from './basicPackage/basicPackage.component';
import { AppStoreService } from './appStore.service';

const appManageRoute: Routes = [
  { path: '', component: AppStoreComponent },
  { path: 'detail/:id', component: AppStoreDetail },
  { path: 'saleTool/:id', component: SaleTool },
  { path: 'basicPackage', component: BasicPackage}
];

@NgModule({
  imports: [CommonModule, HeaderModule,LoadingModule, FormsModule, ShufflingModule, SideNavModule, RouterModule.forChild(appManageRoute)],
  declarations: [AppStoreComponent, AppStoreDetail, BasicPackage, SaleTool],
  exports: [
    RouterModule
  ],
  providers: [AppStoreService]
})
export class AppStoreModule { }
