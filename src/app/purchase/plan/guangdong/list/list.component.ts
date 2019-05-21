import { Component, OnInit, ViewEncapsulation,OnDestroy } from '@angular/core';

import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { DataService } from './list.service';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../../../+common/services/auth.service';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import { environment } from '../../../../../environments/environment';
import { State,CompositeFilterDescriptor } from '@progress/kendo-data-query';
import {GridDataResult, DataStateChangeEvent}from '@progress/kendo-angular-grid';


declare var $: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'list',
    templateUrl: './list.html',
    styleUrls: ['./list.css']
})
export class ListComponent implements OnDestroy{
	sub1;
    public whichIsActive = "Plan";
	public view: Observable<GridDataResult>;
	private opened:boolean = false;
	private filtrateBoxIsSHow: boolean = false;
    private filters = {
        type:[],
		executeStatus: [] //发电类型s
	}
    public state: State = {
        skip: 0,
        take: 10
    }; 
	public dataStateChange(state: DataStateChangeEvent): void {
        this.state.skip = state.skip;
        this.state.take = state.take;
        this.service.query(this.state);
    }
	constructor(public service:DataService,private auth:AuthHttpService, private http: Http) {
		
		this.view = service;
		console.log(service)
        this.service.query(this.state);
	} 


    ngOnInit() {};

    showFiltrateBox() {
		this.filtrateBoxIsSHow = !this.filtrateBoxIsSHow;
	}
    searchPlan(e) {
		 
		this.state.filter = { logic:"and", filters:[{field:"name", operator: "contains", value: e}]};
		this.service.query(this.state);
	}
    checkTypeChange(e) {
		var type =e.currentTarget.value == '1' ?1:2;
		if(e.currentTarget.checked){
			this.filters.type.push(type);
		}
		else{
			var del = this.filters.type.indexOf(type);
			this.filters.type.splice(del,1);
		}
	}
    checkStatusChange(e) {
		var executeStatus = e.currentTarget.value == '0'?0:1;
		if(e.currentTarget.checked){
			this.filters.executeStatus.push(executeStatus);
		}
		else{
			var del = this.filters.executeStatus.indexOf(executeStatus);
			this.filters.executeStatus.splice(del,1);
		}
	}
    conditionSearch() {
		this.state.filter = { logic:"and", filters:[]};
		if(this.filters.type != null && this.filters.type.length > 0){
			var typeFilters: CompositeFilterDescriptor = { logic:"or", filters:[]};
			this.filters.type.forEach(e => {
				typeFilters.filters.push({field:"type", operator: "eq", value: e});
			});
			this.state.filter.filters.push(typeFilters);
		}
		else{
			this.state.filter.filters.push({ logic:"or", filters:[{field:"type", operator: "eq", value: 1},{field:"type", operator: "eq", value: 2}]});
		}

		if(this.filters.executeStatus != null && this.filters.executeStatus.length > 0){
			var typeFilters: CompositeFilterDescriptor = { logic:"or", filters:[]};
			this.filters.executeStatus.forEach(e => {
				typeFilters.filters.push({field:"executeStatus", operator: "eq", value: e});
			});
			this.state.filter.filters.push(typeFilters);
		}
		else{
			this.state.filter.filters.push({ logic:"or", filters:[{field:"executeStatus", operator: "eq", value: 1},{field:"executeStatus", operator: "eq", value: 0}]});
		}

		this.service.query(this.state);
	}
	searchReset(){
		 
		 $(".filtrate-box input[type='checkbox']").prop("checked", false);
		 
		this.filters.executeStatus =[];
		this.filters.type =[];
	}

    deleteId = "";
    deleteClick(e){
        this.deleteId = e.currentTarget.dataset.id;
        this.opened = true;
		console.log(this.deleteId);
    }
	closeDialog(e){
        this.deleteId = "";
        this.opened = false;
    }

	 private headers = new Headers({ 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers });
    deletePlan(){
		this.sub1=this.auth.post(`${environment.sellerEnergyPurchaseApi}api/GDPurchasePlan/Delete?id=${this.deleteId}`,this.options).subscribe((res)=>{
            let result = res.json();
             console.log(result);
			 this.deleteId = "";
			 this.opened = false;
            if(result.result){
                this.service.query(this.state);
            }
			else{
				alert(result.message);
			}
        })
    }
      
        ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
    }
}