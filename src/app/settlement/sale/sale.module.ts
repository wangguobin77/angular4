import { NgModule, Component }           from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from '../../+common/services/auth-guard.service';
import { LayoutModule } from '../../+common/layout/layout.module';

declare var $: any;

@Component({
    selector: 'sale',
    template: '<slidebar></slidebar><router-outlet></router-outlet>'
})
export class SaleComponent {
    ngOnInit() {
        $.showMenu(1);
    }
    ngAfterViewInit(){
        $.showSide(10701);
    }
}

const router: Routes = [
    {
        path: '',
        component: SaleComponent,
        children: [
            {
                path: 'anhui/list',
                loadChildren: './anhui/list/listsale.module#ListModule',
            },
            {
                path: 'guangdong/list',
                loadChildren: './guangdong/list/listsale.module#ListModule',
            },
            {
                path: 'shanxi/list',
                loadChildren: './shanxi/list/listsale.module#ListModule',
            }
        ]
    }
];

@NgModule({
    imports: [ 
        LayoutModule,
        RouterModule.forChild(router) 
    ],
    declarations: [SaleComponent],
    exports: [
        RouterModule
    ]
})
export class SaleModule{ }