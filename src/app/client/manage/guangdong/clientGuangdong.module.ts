import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule } from '../../../+common/layout/layout.module';
import { GuangdongList } from './list/list';
import { GuangdongBuild } from './build/build.component';
import { DataService } from './list/list.service';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
const guangdongRoute: Routes = [
    {
        path: '',
        component: GuangdongList
    },
    {
        path: 'list',
        component: GuangdongList
    },
    {
        path: 'build',
        component: GuangdongBuild
    },
    {
        path: 'detail',
        loadChildren: './detail/guandongDetail.module#DetailModule'
    },
    {
        path: 'detailPage',
        loadChildren: './detailPage/guangdongClientDetailPage.module#DetailAPageModule'
    },
    {
        path: 'customergd/:id',
        loadChildren: './customergd/customergd.module#customergdModule'
    },
    {
        path: 'newPrice',
        loadChildren: './newPrice/guangdongNewPrice.module#GuangdongNewPriceModule'
    }
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LayoutModule,
        GridModule,
        DropDownsModule,
        DialogModule,
        InputsModule,
        ReactiveFormsModule,
        RouterModule.forChild(guangdongRoute)
    ],
    declarations: [GuangdongList, GuangdongBuild],
    exports: [
        RouterModule
    ],
    providers: [DataService]
})
export class GuangdongModule { }