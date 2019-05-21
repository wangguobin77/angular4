import { Component,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import{ environment } from '../../../../../environments/environment';
declare var $:any;

@Component({
    selector: 'ElectricityFactoryListDetail-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.scss']
})
export class ElectricityFactoryListDetailCreate implements OnDestroy{
	sub1;sub2;sub3;sub4;
	constructor(private router: Router,private auth: AuthHttpService, private http: Http) {};
	private headers = new Headers({ 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers });
	//电厂
	powerPlantData:Array<string> = [];

    //地区
	private provinceData:Array<{name:string,code:number}> = [];	
	private cities:Array<{name:string,code:number}> = [];	
	getProvince(){
		let getProvinceUrl = `${environment.sellerCRMApi}api/Customer/GetProvince`;
		this.sub1=this.auth.get(getProvinceUrl).subscribe((res)=>{
			let result=res.json();
            this.provinceData = result;
		});
	}
	provinceChange(e){
		this.cities = [];
		this.getCities(e);
	}
	getCities(provinceCode){
		let citiesUrl = `${environment.sellerCRMApi}api/Customer/GetCities/?parentCode=${provinceCode}`;
		this.sub2=this.auth.get(citiesUrl).subscribe((res)=>{
			let result=res.json();
            this.cities = result;
		});
	}
	provincePlaceHolder = {name:"请选择省份",code:null};
	cityPlaceHolder = {name:"请选择城市",code:null};


	//发电类型
	types:Array<{text:string,value:number}> = [
		{text:"火力",value:1},
		{text:"水力",value:2},
		{text:"风力",value:3},
		{text:"光伏",value:4}
	]
	typePlaceHolder = {text:"请选择发电类型",value:null};

	//电压等级
	private voltageLevelData:Array<{text:string,value:number}> = [
		{text:"不满1千伏",value:1},
		{text:"1-10千伏",value:2},
		{text:"20千伏",value:3},
		{text:"35-110千伏",value:5},
		{text:"220千伏及以上",value:8},
		{text:"35千伏",value:4},
		{text:"110千伏",value:6},
		{text:"220千伏",value:7}
	]

	onsubmit(e,m){
		this.sub3=this.auth.post(`${environment.sellerEnergyPurchaseApi}api/ElectricityFactory/EditElectricityFactory`,m.value,this.options).subscribe((res)=>{
			console.log(res);
			let result = res.json();
			if(result.result){
				//跳转到详情页面
				this.router.navigate(['/purchase/eFactory/detail',result.message]);
			}
			else{
				alert(result.message);
			}
		})
	}

	ngOnInit(){
		this.getProvince();
		//获取电厂
		this.sub4=this.auth.get(`${environment.sellerEnergyPurchaseApi}api/ElectricityFactory/GetElectricityFactory`).subscribe((res)=>{
		    let result = res.json();
		    this.powerPlantData = result;
		})
	}
	    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe();}
		if (this.sub4 !== undefined && this.sub4 !== null) { this.sub4.unsubscribe();}
    }
}