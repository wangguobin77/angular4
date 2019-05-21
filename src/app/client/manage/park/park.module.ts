import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule } from '../../../+common/layout/layout.module';
import { ParkList } from './list/list';
import { ParkBuild } from './build/build.component';
import { DataService } from './list/list.service';
import { ContactService } from './build/contact.service';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
const parkRoute: Routes = [
    {
        path: '',
        component: ParkList
    },
    {
        path: 'list',
        component: ParkList
    },
    {
        path: 'build',
        component: ParkBuild
    },
    {
        path: 'detail',
        loadChildren: './detail/parkDetail.module#DetailModule'
    }
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LayoutModule,
        GridModule,
        DropDownsModule,
        InputsModule,
        DialogModule,
        ReactiveFormsModule,
        RouterModule.forChild(parkRoute)
    ],
    declarations: [ParkList, ParkBuild],
    exports: [
        RouterModule
    ],
    providers: [DataService,ContactService]
})
export class ClientParkModule { }