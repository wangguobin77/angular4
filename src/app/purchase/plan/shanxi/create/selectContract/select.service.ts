import { Injectable ,EventEmitter,OnInit} from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class SelectContractService{
	public totleCount:number = 0;
	public radioChecked:boolean = true;
	public planName:string = "";
	public time:any;
	public tradingCenter:number = 0;
	public remark:string = "";
    public dataFilter = {
	  "contactType": 1,
	  "usePowerType": 0,
	  "name":"",
	  "planYear": 2016,
	  "planMonth": 0
	}
	public detail=[];
	public setData(m,n){
		 
		this.time = n;
		this.dataFilter.contactType = m;
		this.dataFilter.planYear = n.getFullYear();
		this.dataFilter.planMonth = n.getMonth()+1;
	}
	public setTotelCount(m,ds){
		this.totleCount = m;
		this.detail = ds
	}
	
	public setValue(p,r,t){
		this.planName = p;
		this.remark = r;
		this.tradingCenter = t;
	}
}
