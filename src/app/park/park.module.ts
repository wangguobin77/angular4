import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule } from '../+common/layout/layout.module';
import { List } from './manage/shanxi/list/list';
import { Build } from './manage/shanxi/build/build.component';
import { Park } from './park';
import { DataService } from './manage/list.service';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
const serviceRoute: Routes = [
    {
        path: '',
        component: Park,
        children: [
            {
                path: 'shanxi',
                children: [
                    {
                        path: '',
                        component: List
                    },
                    {
                        path: 'list',
                        component: List
                    },
                    {
                        path: 'build',
                        component: Build
                    },
                    {
                        path: 'detail',
                        loadChildren: './manage/shanxi/detail/detail.module#DetailModule'
                    },
                    {
                        path: 'detailPage',
                        loadChildren: './manage/detailPage/detailPage.module#ParkDetailPageModule'
                    }
                ]
            }
        ]
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
        RouterModule.forChild(serviceRoute)
    ],
    declarations: [List, Park, Build],
    exports: [
        RouterModule
    ],
    providers: [DataService]
})
export class ParkModule { }