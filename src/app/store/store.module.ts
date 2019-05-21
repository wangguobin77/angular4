import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '../+common/header/header.module';
import { LoadingModule } from '../+common/loading/loading.module';
import { SideNavModule } from './sideNav/sideNav.module';
import { ShufflingModule } from '../+common/shuffling/shuffling.module';
import { SideNavService } from './sideNav/sideNav.service';
import { StoreComponent } from './store';
import { Purchased } from './purchased/purchased.component';

const storeRoute: Routes = [
    {
        path: '',
        component: StoreComponent,
        children: [
            {
                path: '',
                loadChildren: './appStore/appStore.module#AppStoreModule'
            },
            {
                path: 'tradingCenter',
                loadChildren: './tradingCenter/tradingCenter.module#TradingCenterModule'
            },
            {
                path: 'appManage',
                loadChildren: './appManage/appManage.module#AppManageModule'
            },
            {
                path: 'appStore',
                loadChildren: './appStore/appStore.module#AppStoreModule'
            },
            {
                path: 'orderRecord',
                loadChildren: './orderRecord/orderRecord.module#OrderRecordModule'
            },
            {
                path: 'cart',
                loadChildren: './shoppingCart/shoppingCart.module#ShoppingCartModule'
            },
            {
                path: 'purchased',
                component: Purchased
            }
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HeaderModule,
        SideNavModule,
        LoadingModule,
        ShufflingModule,
        RouterModule.forChild(storeRoute)
    ],
    declarations: [StoreComponent, Purchased],
    exports: [
        RouterModule
    ],
    providers: [SideNavService]
})
export class StoreModule { }