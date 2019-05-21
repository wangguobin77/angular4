import { Component, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { NewPriceService } from './list.service';
import { Observable } from 'rxjs/Observable';
import { State } from '@progress/kendo-data-query';
import { environment } from '../../../../../../environments/environment';
import { AuthHttpService } from '../../../../../+common/services/auth-http.service';
import { ActivatedRoute } from '@angular/router';
import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';
@Component({
    selector: 'newPrice-list',
    templateUrl: './list.component.html',
    styleUrls:['./list.scss']
})
export class List{
	sub1;
	public view: Observable<GridDataResult>;
	
    public state: State = {
        skip: 0,
        take: 5,
    }; 
	public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.service.query(state);
    }
	constructor(private service:NewPriceService,private auth:AuthHttpService,private route:ActivatedRoute){
		service.pageId = this.route.snapshot.params['id'];
		this.view = service;
        this.service.query(this.state);
	}
	onChange(list,e){
		if(this.service.checkedArr.length==4||this.service.checkedArr.length==5){
			this.service.query(this.state);
		}
		let index = this.service.checkedArr.indexOf(list.SalePackagesId);
		if(index>=0){
			this.service.checkedArr.splice(index,1);
		}else{
			this.service.checkedArr.push(list.SalePackagesId);
		}
		localStorage.setItem('selectedPackages',JSON.stringify(this.service.checkedArr));
	}
	pageId:any;
	ngOnInit(){
		this.pageId = this.route.snapshot.params['id'];
	}
	ngOnDestroy(){

	}
}