import { NgModule, Component }           from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from '../../+common/services/auth-guard.service';
import { LayoutModule } from '../../+common/layout/layout.module';

declare var $: any;

@Component({
    selector: 'purchase',
    template: '<slidebar></slidebar><router-outlet></router-outlet>'
})
export class PurchaseComponent {
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
        component: PurchaseComponent,
        children: [
            {
                path: 'anhui/list',
                loadChildren: './anhui/list/listpurchase.module#ListModule',
            },
            {
                path: 'guangdong/list',
                loadChildren: './guangdong/list/listpurchase.module#ListModule',
            },
            {
                path: 'shanxi/list',
                loadChildren: './shanxi/list/listpurchase.module#ListModule',
            }
        ]
    }
];

@NgModule({
    imports: [ 
        LayoutModule,
        RouterModule.forChild(router) 
    ],
    declarations: [PurchaseComponent],
    exports: [
        RouterModule
    ]
})
export class PurchaseModule{ }