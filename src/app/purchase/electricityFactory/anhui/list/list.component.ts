import { Component ,OnDestroy} from '@angular/core';
import { DataService } from './list.service';
import { Observable } from 'rxjs/Observable';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import { environment } from '../../../../../environments/environment';
import { State,CompositeFilterDescriptor } from '@progress/kendo-data-query';
import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';

declare var $:any;

@Component({
    selector: 'electricityFactory-list',
    templateUrl: './list.component.html',
    styleUrls:['./list.scss']
})
export class ElectricityFactoryList implements OnDestroy{
	sub1;sub2;
	public whichIsActive = "ElectricityFactory";
	public view: Observable<GridDataResult>;
	private opened:boolean = false;
	private filtrateBoxIsSHow: boolean = false;
	private filters = {
		provinceCode: null,
		citiesCode: null,
		generationType: [] //发电类型
	}
    public state: State = {
        skip: 0,
        take: 10
    }; 
	public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.service.query(state);
    }
	constructor(public service:DataService,private auth:AuthHttpService) {
		
		this.view = service;
		console.log(service)
        this.service.query(this.state);
	} 
	//条件查询
	public provincePlaceHolder: { name: string, code: string } = { name: "省/直辖市", code: null };
	public citiesPlaceHolder: { name: string, code: string } = { name: "市/区", code: null };
	private province: Array<{ name: string, code: number }> = [];
	private cities: Array<{ name: string, code: number }> = [];
    private ngProvince = null;
	private ngCity = null;


	ngOnInit(){
		
		this.getProvince();
	}
	showFiltrateBox() {
		this.filtrateBoxIsSHow = !this.filtrateBoxIsSHow;
	}
	searchFactory(e) {
		 
		this.state.filter = { logic:"and", filters:[{field:"name", operator: "contains", value: e}]};
		this.service.query(this.state);
	}
	getProvince() {
		let getProvinceUrl = `${environment.sellerEnergyPurchaseApi}api/CommonPurchase/GetCities?parentCode=1`;
		this.sub1=this.auth.get(getProvinceUrl).subscribe((res) => {
			let result = res.json();
			 
			this.province = result;
		});
	}
	provinceChange(e) {
		this.cities = [];
		this.filters.provinceCode = e.code;
		this.getCities(e.code);
	}
	getCities(provinceCode) {
		let citiesUrl = `${environment.sellerEnergyPurchaseApi}api/CommonPurchase/GetCities?parentCode=${provinceCode}`;
		this.sub2=this.auth.get(citiesUrl).subscribe((res) => {
			let result = res.json();
			this.cities = result;
		});
	}
	citiesChange(e) {
		this.filters.citiesCode = e.code;
	}

	checkChange(e) {
		if(e.currentTarget.checked){
			this.filters.generationType.push(e.currentTarget.value);
		}
		else{
			var del = this.filters.generationType.indexOf(e.currentTarget.value);
			this.filters.generationType.splice(del,1);
		}
	}

	conditionSearch() {
		this.state.filter = { logic:"and", filters:[]};
		if(this.filters.provinceCode != null && this.filters.provinceCode != ""){
			this.state.filter.filters.push({field:"province", operator: "eq", value: this.filters.provinceCode});
		}
		if(this.filters.citiesCode != null && this.filters.citiesCode != ""){
			this.state.filter.filters.push({field:"city", operator: "eq", value: this.filters.citiesCode});
		}
		if(this.filters.generationType != null && this.filters.generationType.length > 0){
			var typeFilters: CompositeFilterDescriptor = { logic:"or", filters:[]};
			this.filters.generationType.forEach(e => {
				typeFilters.filters.push({field:"TypeName", operator: "contains", value: e});
			});
			this.state.filter.filters.push(typeFilters);
		}
		if(this.state.filter.filters.length < 1){
		this.state.filter = null;
		}
		this.service.query(this.state);
	}
	searchReset(){
		 
		 $(".filtrate-box input[type='checkbox']").prop("checked", false);
		 this.ngProvince = null;
		this.ngCity = null;
		this.filters.provinceCode = "";
		this.filters.citiesCode  = "";
		this.filters.generationType =[];
	}
	    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
    }
}