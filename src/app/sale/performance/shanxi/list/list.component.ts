import {Component} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { State,CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import { DataService } from './list.service';
import { environment } from '../../../../../environments/environment';
import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';

@Component({
  selector: 'list',
  templateUrl: './list.html',
  styleUrls:['./list.scss']
})
export class ListComponent {
	public view: Observable<GridDataResult>;
    public state: any = {
        skip: 0,
        take: 10
    }; 
	public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.service.query(state);
    }
    private topData = {};
	constructor(public service:DataService,private auth:AuthHttpService) {
        this.service.query(this.state);
		this.view = service;
     
       this.sub.push(auth.get(`${environment.sellerCRMApi}api/PerformanceSX/CustomerPurchaseInfo`).subscribe((res)=>{
            this.topData = res.json();
        }));
	} 
	private sub:Array<any> = [];
	ngOnDestroy(){
		for(let k of this.sub){
			if (k !== undefined && k !== null) { k.unsubscribe();}
		}
	}
}