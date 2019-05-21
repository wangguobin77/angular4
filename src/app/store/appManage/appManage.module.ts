import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule,Routes }  from '@angular/router';
import { HeaderModule }  from '../../+common/header/header.module';
import { SideNavModule }  from '../sideNav/sideNav.module';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { AppManage }  from './appManage';
import { AppManageService } from './appManage.service';

const appManageRoute: Routes = [
	{path: '',component:AppManage},
];

@NgModule({
  imports:      [ CommonModule,HeaderModule,GridModule,DialogModule, FormsModule,SideNavModule,RouterModule.forChild(appManageRoute) ],
  declarations: [AppManage],
  exports: [
    RouterModule
  ],
  providers: [{ provide: AppManageService, useClass: AppManageService}]
})
export class AppManageModule{}