import { Injectable } from '@angular/core';
@Injectable()
export class DetailService{
	public id:number;
	public isActive:boolean;
	public whichIsActive:string;
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
			name:"销售信息",
			isActive:false,
			url:"sale"
		},
		{
			name:"合约管理",
			isActive:false,
			url:"contract"
		}
	]
	setActive(currentUrl){
		for(let k in this.menu){
			this.menu[k].isActive = false;
			if(this.menu[k].url == currentUrl) {
				this.menu[k].isActive = true;
			}
		}
	}
}