import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule } from '../../../+common/layout/layout.module';
import { ShanxiList } from './list/list';
import { AnhuiBuild } from './build/build.component';
import { DataService } from './list/list.service';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
const shanxiRoute: Routes = [
    {
        path: '',
        component: ShanxiList
    },
    {
        path: 'list',
        component: ShanxiList
    },
    {
        path: 'build/:id',
        component: AnhuiBuild
    },
    {
        path: 'detail',
        loadChildren: './detail/shanxiDetail.module#DetailModule'
    },
    {
        path: 'detailPage',
        loadChildren: './detailPage/clientDetailPage.module#ShanxiDetailAPageModule'
    },
     {
        path: 'customersx/:id',
        loadChildren: './customersx/customersx.module#customersxModule'
    },
    {
        path: 'newPrice',
        loadChildren: './newPrice/SXnewPrice.module#SXnewPriceModule'
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
        ReactiveFormsModule,
        DialogModule,
        RouterModule.forChild(shanxiRoute)
    ],
    declarations: [ShanxiList, AnhuiBuild],
    exports: [
        RouterModule
    ],
    providers: [DataService]
})
export class ClientShanxiModule { }