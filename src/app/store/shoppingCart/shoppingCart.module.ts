import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingCart } from './shoppingCart';
import { FirstStepCart } from './first/first';
import { SecondStepCart } from './second/second';
import { ThirdStepCart } from './third/third';
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import {ShoppingCartService} from './shoppingCart.service'
const shoppingCartRoute: Routes = [
    {
        path: '',
        component: ShoppingCart,
        children:[
            {
                path:'',
                redirectTo: 'first',
                pathMatch: 'full'
            },
        	{
        		path:'first',
        		component: FirstStepCart
        	},
            {
                path:'second',
                component: SecondStepCart
            },
            {
                path:'third/:id',
                component: ThirdStepCart
            }
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        GridModule,
        DropDownsModule,
        InputsModule,
        DialogModule,
        ReactiveFormsModule,
        RouterModule.forChild(shoppingCartRoute)
    ],
    declarations: [ShoppingCart,FirstStepCart,SecondStepCart,ThirdStepCart],
    exports: [
        RouterModule
    ],
    providers: [ShoppingCartService]
})
export class ShoppingCartModule { }