import {Component,OnDestroy} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { State,CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { AuthHttpService } from '../../../+common/services/auth-http.service';
import { DataService } from './list.service';
import { environment } from '../../../../environments/environment';
import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';

@Component({
  selector: 'list',
  templateUrl: './list.component.html'
})
export class List implements OnDestroy {
	public view: Observable<GridDataResult>;
    public state: State = {
        skip: 0,
        take: 10
    }; 
	public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.service.query(state);
    }
	constructor(public service:DataService,private auth:AuthHttpService) {
        this.service.query(this.state);
		this.view = service;
	} 
	private sub:Array<any> = [];
	removeHandler({dataItem}){
		this.opened = true;
		this.deleteID = dataItem.Id;
	}
	opened = false;
	deleteID:number;
	close(){
		this.opened = false;
	}
	deleteSubmit(){
		this.sub[0] = this.auth.delete(`${environment.sellerRiskApi}api/BidPriceForecast/DeleteBidPriceForecast/${this.deleteID}`).subscribe((res)=>{
			this.service.query({
		        skip: 0,
		        take: 10
		    });
		    this.opened = false;
		})
	}
	ngOnDestroy(){
		for(let k of this.sub){
			if (k !== undefined && k !== null) { k.unsubscribe();}
		}
	}
}