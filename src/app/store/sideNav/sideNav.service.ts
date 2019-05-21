import { Injectable ,EventEmitter,OnInit} from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class SideNavService{
    public menuList = [
		{
			"name":"tradingCenter",
			"text":"交易中心",
			"url":"/store/tradingCenter",
			"icon":"iconfont icon-jiaoyi",
			"isActive":false,
			"isNew":false
		},
		{
			"name":"purchased",
			"text":"已购应用",
			"url":"/store/purchased",
			"icon":"iconfont icon-lecloud_wodeyingyong",
			"isActive":false,
			"isNew":false
		},
		{
			"name":"appStore",
			"text":"应用商城",
			"url":"/store/appStore",
			"icon":"iconfont icon-yingyong",
			"isActive":false,
			"isNew":true
		},
		{
			"name":"appManage",
			"text":"应用管理",
			"url":"/store/appManage",
			"icon":"iconfont icon-yingyongguanli",
			"isActive":false,
			"isNew":false
		},
		{
			"name":"orderRecord",
			"text":"订单记录",
			"url":"/store/orderRecord",
			"icon":"iconfont icon-order",
			"isActive":false,
			"isNew":false
		},
		{
			"name":"shoppingCart",
			"text":"购物车",
			"url":"/store/cart/first",
			"icon":"iconfont icon-mangouwuche",
			"isActive":false,
			"isNew":false
		}
	];
	setWhichIsActive(whichIsActive:string){
		for(let k of this.menuList){
			k.isActive = false;
			if(whichIsActive == k.name){
				k.isActive = true;
			}
		}
	}
}
