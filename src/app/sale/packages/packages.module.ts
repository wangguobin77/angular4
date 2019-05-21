import { NgModule, Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../+common/services/auth-guard.service';
import { LayoutModule } from '../../+common/layout/layout.module';
import { KendoModule } from '../../+common/module/kendo.module';

import { DataService } from './list/list.service';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { DetailComponent } from './detail/detail.component';
import { EditComponent } from './edit/edit.component';

declare var $: any;

@Component({
    selector: 'Packages',
    template: '<slidebar></slidebar><router-outlet></router-outlet>'
})

export class PackagesComponent implements AfterViewInit, OnInit {
    ngOnInit() {
        $.showMenu(1);
    }
    ngAfterViewInit() {
        $.showSide(11101);
    }
}

const router: Routes = [
    {
        path: '',
        component: PackagesComponent,
        canActivate: [AuthGuardService],
        children: [
            {
                path: '',
                component: ListComponent,
            },
            {
                path: 'create',
                component: CreateComponent,
            },
            {
                path: 'detail/:id',
                component: DetailComponent,
            },
            {
                path: 'edit/:id',
                component: EditComponent,
            }
        ]
    }
];

@NgModule({
    imports: [
        LayoutModule,
        KendoModule,
        RouterModule.forChild(router)
    ],
    declarations: [PackagesComponent,ListComponent,CreateComponent,DetailComponent,EditComponent],
    providers: [DataService]
})
export class PackagesModule { }
