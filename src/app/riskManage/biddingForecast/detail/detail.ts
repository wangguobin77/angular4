import {Component} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { State,CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { AuthHttpService } from '../../../+common/services/auth-http.service';
import { environment } from '../../../../environments/environment';
import 'hammerjs';
import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';
declare var $: any;

@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls:['./detail.scss']
})
export class Detail {
	private series: any[] = [{
	    name: "最大值",
	    data: []
	}, {
	    name: "平均值",
	    data: []
	}, {
	    name: "最小值",
	    data: []
	}];
	private categories: number[] = [];
	sub1;
	sub2;
	constructor(private auth:AuthHttpService){
	}
	getData(m){
		this.sub1 = this.auth.get(`${environment.sellerRiskApi}api/BidPriceForecast/GetBidPriceForecastResultData/3/${m}`).subscribe((res)=>{
			this.categories = [];
			for(let i of this.series){
				i.data = [];
			}
			for(let k of res.json()){
				this.categories.push(k.Month);
				this.series[0].data.push(k.High);
				this.series[1].data.push(k.Avg);
				this.series[2].data.push(k.Low);
			}
		})
	}
	ngOnInit(){
		this.getData(new Date().getFullYear());
		this.sub2 = this.auth.get(`${environment.sellerRiskApi}api/BidPriceForecast/StartForcast/7/2017/3`).subscribe((res)=>{
			debugger;
		})
	}
	ngAfterViewInit(){
		var _this = this;
		$("#datePicker").kendoDatePicker({
		    start: "decade",
		    depth: "decade",
		    format: "yyyy",
		    value: new Date(),
		    change:function(){
		    	_this.getData(this._oldText);
		    }
		});
	}
	ngOnDestroy(){
		if(this.sub1!=undefined&&this.sub1!=null)this.sub1.unsubscribe();
	}
}