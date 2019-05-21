import { Injectable } from '@angular/core';
@Injectable()
export class DetailService{
	public id:number;
	public isActive:boolean;
	public whichIsActive:string;
	public isSale:boolean;
	public menu = [
		{
			name:"客户信息",
			isActive:false,
			url:"client"
		},
		{
			name:"用电信息",
			isActive:false,
			url:"power"
		},
		{
			name:"合约信息",
			isActive:false,
			url:"contract"
		},
		{
			name:"报价记录",
			isActive:false,
			url:"record"
		}
	]
	public saleMenu = [
		{
			name:"销售信息",
			isActive:false,
			url:"sale"
		}
	]
	setActive(currentUrl){
		for(let k in this.menu){
			this.menu[k].isActive = false;
			if(this.menu[k].url == currentUrl) {
				this.menu[k].isActive = true;
			}
		}
		if(currentUrl=='sale'){
			this.isSale = true;
		}else{
			this.isSale = false;
		}
	}
}