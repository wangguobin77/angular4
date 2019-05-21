import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule } from '../../../+common/layout/layout.module';
import { AnhuiList } from './list/list';
import { customer } from './customer/customer';
import { AnhuiBuild } from './build/build.component';
import { DataService } from './list/list.service';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
const anhuiRoute: Routes = [
    {
        path: '',
        component: AnhuiList
    },
    {
        path: 'list',
        component: AnhuiList
    },
    {
        path: 'build',
        component: AnhuiBuild
    },
    {
        path: 'detail',
        loadChildren: './detail/anhuiDetail.module#DetailModule'
    },
    {
        path: 'detailPage',
        loadChildren: './detailPage/anhuiClientDetailPage.module#DetailAPageModule'
    },
    {
        path: 'customer/:id',
        loadChildren: './customer/customer.module#customerModule'
    },
    {
        path: 'newPrice',
        loadChildren: './newPrice/newPrice.module#NewPriceModule'
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
        RouterModule.forChild(anhuiRoute)
    ],
    declarations: [AnhuiList, AnhuiBuild],
    exports: [
        RouterModule
    ],
    providers: [DataService]
})
export class ClientAnhuiModule { }