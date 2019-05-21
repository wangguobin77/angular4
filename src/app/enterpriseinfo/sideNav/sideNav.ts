import {Input,Component,Output,EventEmitter} from '@angular/core';

@Component({
  selector: 'sideNav',
  templateUrl: './sideNav.html',
  styleUrls:['./sideNav.scss']
})
export class sideNav{
  @Input() 
	public whichIsActive:string;
	public menuList = [
		{
			"name":"tradingCenter",
			"text":"企业信息",
			"url":"/enterprisesset/sellerinformation",
			"icon":"iconfont icon-qiyexinxi",
			"isActive":false,
			"isNew":false
		},
		{
			"name":"appOfBought",
			"text":"员工管理",
			"url":"/enterprisesset/staffmanagement",
			"icon":"iconfont icon-kehuguanli",
			"isActive":false,
			"isNew":false
		},
		{
			"name":"appManage",
			"text":"角色管理",
			"url":"/enterprisesset/stafflist",
			"icon":"iconfont icon-jiaoseguanli1",
			"isActive":false,
			"isNew":false
		},
		{
			"name":"orderRecord",
			"text":"登录日志",
			"url":"",
			"icon":"iconfont icon-denglurizhi",
			"isActive":false,
			"isNew":false
		},
		{
			"name":"shoppingCart",
			"text":"企业公告",
			"url":"",
			"icon":"iconfont icon-laba",
			"isActive":false,
			"isNew":false
		}
	]
	ngOnInit(){
		for(let k of this.menuList){
			if(this.whichIsActive == k.name){
				k.isActive = true;
			}
		}
	}
	changeActive(event,i){
		let e = event.currentTarget;
		for(let k of this.menuList){
			k.isActive = false;
		}
		this.menuList[i].isActive = true;
	}
}