import {Component,ViewEncapsulation} from '@angular/core';
import { SideNavService } from '../sideNav/sideNav.service';
import {ShoppingCartService} from './shoppingCart.service';
@Component({
	encapsulation: ViewEncapsulation.None,
  	selector: 'shoppingCart',
  	templateUrl: './shoppingCart.component.html',
  	styleUrls:['./shoppingCart.scss']
})
export class ShoppingCart{
	private stepList = [];
	constructor(public sideNavService:SideNavService,private shopService:ShoppingCartService){
		this.sideNavService.setWhichIsActive("shoppingCart");
		this.stepList = shopService.stepList;
	}
}