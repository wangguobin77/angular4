import {Component} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { State,CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { AuthHttpService } from '../../../+common/services/auth-http.service';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../+common/services/auth.service';
import { Router} from '@angular/router';
import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';

@Component({
  selector: 'create',
  templateUrl: './create.component.html',
  styleUrls:['./create.scss']
})
export class Create {
	dateDuring:Array<{text:string,value:number}> = [
		{text:"未来12个月",value:12},
		{text:"未来24个月",value:24},
		{text:"未来36个月",value:36}
	]
	dateDur = 12;

	area:Array<{text:string,value:number}> = [
		{text:"安徽",value:340000},
		{text:"山西",value:140000},
		{text:"广东",value:440000}
	]
	dateDuringChange(e){
		this.endDate = new Date(this.value.getFullYear()+(e/12),this.value.getMonth(),this.value.getDate());
	}

	public value: Date = new Date();
	public endDate:Date = new Date(this.value.getFullYear()+1,this.value.getMonth(),this.value.getDate());
	sub1;
	sub2;
	public predictionModelData = [];
	constructor(private auth:AuthHttpService,private service:AuthService,private router:Router){
		this.sub1 = auth.get(`${environment.sellerRiskApi}api/BidPriceForecast/GetPredictionModel`).subscribe((res)=>{
			this.predictionModelData = res.json();
		})
	}
	ngOnDestroy(){
		if(this.sub1!=undefined&&this.sub1!=null)this.sub1.unsubscribe();
		if(this.sub2!=undefined&&this.sub2!=null)this.sub2.unsubscribe();
	}

	private postData = {
	  "tradingCenterId": this.service.currentTradingCenter.id,
	  "forecastName": "",
	  "administrativeArea": this.service.currentTradingCenter.id == 34?340000:this.service.currentTradingCenter.id==14?140000:440000,
	  "beginForecastTime": this.value,
	  "endForecastTime": this.endDate,
	  "modelName": "",
	  "modelType": 1,
	}
	onSubmit(m){
		this.postData.modelName = m.value.predictionModel.categoryValue;
		this.postData.modelType = m.value.predictionModel.categoryKey;
		this.sub2 = this.auth.post(`${environment.sellerRiskApi}api/BidPriceForecast/SaveBidPriceForecast`,this.postData).subscribe((res)=>{
			if(res.ok){
				this.router.navigate(['/riskManage/bid/detail']);
			}
		})
	}
}