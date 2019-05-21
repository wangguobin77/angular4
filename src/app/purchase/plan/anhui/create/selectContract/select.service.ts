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
	public details=[];
	public setData(m,n,z){
		 
		this.time = n;
		this.dataFilter.contactType = m;
		this.dataFilter.planYear = n.getFullYear();
		if(z == 0) {
			this.dataFilter.planMonth = n.getMonth()+1;
		}else{
			this.dataFilter.planMonth = 0;
		}
	}
	public setTotelCount(m,ds){
		this.totleCount = m;
		if(ds!= null && ds.length > 0){
			for(let d of ds) {
				if(d.amount > 0){
				this.details.push(d);
			}
		  }
		}
		// this.details = d;
	}
	public setRadioChecked(m){
		this.radioChecked = m;
	}
	public setValue(p,r,t){
		this.planName = p;
		this.remark = r;
		this.tradingCenter = t;
	}
}
