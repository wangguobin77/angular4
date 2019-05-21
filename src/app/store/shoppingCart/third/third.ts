import {Component} from '@angular/core';
import {ShoppingCartService} from '../shoppingCart.service'
import { ActivatedRoute }  from '@angular/router';
@Component({
  selector: 'third-cart',
  templateUrl: './third.component.html'
})
export class ThirdStepCart {
	constructor(private shopService:ShoppingCartService,public route: ActivatedRoute){
		shopService.stepIsActive(3);
	}
	private orderId:any;
	ngOnInit(){
		this.orderId = this.route.snapshot.params['id'];
	}
}