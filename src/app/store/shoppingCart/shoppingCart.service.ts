import { Injectable ,EventEmitter,OnInit} from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class ShoppingCartService{
	// stepIsActive:number = 1;
	public stepList = [
		{
			name:"选择应用",
			isActive:true,
			icon:'icon-chaozhijifen',
			isFont:false,
			isAfter:true
		},
		{
			name:"提交订单",
			isActive:false,
			icon:'icon-dingdan',
			isFont:true,
			isAfter:true
		},
		{
			name:"收取发票",
			isActive:false,
			icon:'icon-shoukuan',
			isFont:true,
			isAfter:true
		},
		{
			name:"支付款项",
			isActive:false,
			icon:'icon-icon2',
			isFont:true,
			isAfter:true
		},
		{
			name:"完成购买",
			isActive:false,
			icon:'icon-chenggong',
			isFont:true,
			isAfter:false
		}
	];
	stepIsActive(m){
		for(let i = 0;i < this.stepList.length;i ++){
			this.stepList[i].isActive = false;
			if(i < m){
				this.stepList[i].isActive = true;
			}
		}
	}
}
