import { Component } from '@angular/core';
import { GDDataService } from './list.service';
import { Observable } from 'rxjs/Observable';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import { environment } from '../../../../../environments/environment';

import { State } from '@progress/kendo-data-query';
import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';

declare var $:any;

@Component({
    selector: 'contract-list',
    templateUrl: './list.component.html',
    styleUrls:['./list.scss']
})
export class GDContractList{
	public whichIsActive = "EnergyContract";
	public view: Observable<GridDataResult>;
	private opened:boolean = false;
	
    public state: State = {
        skip: 0,
        take: 5,
    }; 
	public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.service.query(state);
    }
	constructor(public service:GDDataService,private auth:AuthHttpService) {
		
		this.view = service;
		console.log(service)
        this.service.query(this.state);
	} 
	ngOnInit(){
		
		this.loadData()
	}
  	public loadData(){
		
	}
	searchContract(e) {
		 
		this.state.filter = {
	        logic:'or',
	        filters: [
                { field: "ElectricityFactoryName", operator: "contains", value: e },
                { field: "Name", operator: "contains", value: e }
	        ]
	    };
		this.service.query(this.state);
	}
}