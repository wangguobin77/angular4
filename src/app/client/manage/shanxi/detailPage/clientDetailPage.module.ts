import {Component} from '@angular/core';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UploadModule } from '@progress/kendo-angular-upload';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute }  from '@angular/router';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DialogModule } from '@progress/kendo-angular-dialog';

import { Aptitude } from './aptitudeUpLoad/aptitude.component';
import { LicenseUpload } from './licenseUpload/license';
import { AptDetail } from './aptDetail/aptDetail';
import { LicenseDetail } from './licenseDetail/licenseDetail';
import { ShufflingModule }  from '../../../../+common/shuffling/shuffling.module';
declare var $:any;
@Component({
        selector: 'client-detail',
        template: `<div class="content-box">
            <div class="pageTitle">
                <i class="iconfont icon-guanxiaobaotubiao16"></i>客户管理
                <a [routerLink]="['/client/shanxi/detail/client',pageId]" class="a-button-xian a-button-xian-grey float-r ma-r20 ma-t10">返回</a>
            </div>
            <router-outlet></router-outlet>
        </div>`
})
export class ClientDetail{
    ngAfterViewInit(){
        $.showSide(10101);
    }
    private pageId:string;
    constructor(public route: ActivatedRoute) {
        this.pageId = route.snapshot.children[0].params.id;
    }
};

const detailPageRoute: Routes = [
    {
        path: '',
        component: ClientDetail,
        children:[
            {
                path: 'aptitudeUpload/:id',
                component: Aptitude,
            },
            {
                path: 'licenseUpload/:id',
                component: LicenseUpload,
            },
            {
                path: 'aptDetail/:id',
                component: AptDetail,
            },
            {
                path: 'licenseDetail/:id',
                component: LicenseDetail,
            }
        ]
    }
];
@NgModule({
    imports: [
        UploadModule,
        CommonModule,
        InputsModule,
        DialogModule,
        ShufflingModule,
        FormsModule,
        RouterModule.forChild(detailPageRoute)
    ],
    declarations: [ClientDetail,Aptitude,LicenseUpload,AptDetail,LicenseDetail],
    exports: [
        RouterModule
    ]
})
export class ShanxiDetailAPageModule{}