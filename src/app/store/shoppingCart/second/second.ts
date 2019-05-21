import {Component, OnDestroy} from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Router} from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AuthHttpService } from '../../../+common/services/auth-http.service';
import { environment } from '../../../../environments/environment';
import {
    FormGroup,
    FormControl
} from '@angular/forms';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {ShoppingCartService} from '../shoppingCart.service'

@Component({
  selector: 'second-cart',
  templateUrl: './second.component.html'
})




export class SecondStepCart implements OnDestroy{
	sub1;
	sub2;sub3;sub4;sub5;
	private gridData =[];
	private formData = {};
	private areaCode = {};
	private sellerName:string;
	private isSellerName:boolean = true;
	private province:Array<{name:string,code:number}> = [];	
	private cities:Array<{name:string,code:number}> = [];	

	constructor(private http:Http,private auth:AuthHttpService,private router:Router,private shopService:ShoppingCartService){
		shopService.stepIsActive(2);
	}


	ngOnInit(){
		this.auth.get(`${environment.appStoreApi}api/CartStep2`).subscribe((res)=>{
			let result = res.json();
			this.formData = result.invoice;
			this.gridData = result.items;
			if(result.sellerName==""||result.sellerName==undefined||result.sellerName==null){
				this.isSellerName = false;
			}else{
				this.isSellerName = true;
				this.sellerName = result.sellerName;
			}
			this.sellerName = result.sellerName;
			if(result.invoice.areaCode != null&&result.invoice.areaCode !=undefined&&result.invoice.areaCode != "") {
				this.areaCode = result.invoice.areaCode;
				this.getProvince(result.invoice.areaCode.proviceCode,result.invoice.areaCode.cityCode);
				this.getCities(result.invoice.areaCode.proviceCode);
			}else{
				this.getProvince(null,null);
			}
			
		})
	}

	nameChange(){
		 
	}

	
	
	provinceName:string;
	cityName:string;
	getProvince(m,n){
		let getProvinceUrl = `${environment.sellerCRMApi}api/Customer/GetProvince`;
		this.sub2=this.auth.get(getProvinceUrl).subscribe((res)=>{
			let result=res.json();
            this.province = result;
            console.log(result)
            if(m==null||n==null)return;
            for(let k of result){
            	if(k.code == m){
            		// this.provinceDetail = {name:k.name,code:k.code};
            		this.provinceDetail = k.code;
            		this.getDefaultCity(m,n)
            	}
            }
		});
	}
	getDefaultCity(v,j){
		let citiesUrl = `${environment.sellerCRMApi}api/Customer/GetCities/?parentCode=${v}`;
		this.sub3=this.auth.get(citiesUrl).subscribe((res)=>{
			let result=res.json();
			this.cities = result;
			for(let k of result){
				if(k.code == j) {
					// this.city = {name:k.name,code:k.code};
					this.city = k.code;
				}
			}
		});
	}
	provinceChange(e){
		this.cities = [];
		this.getCities(e);
	}
	getCities(province){
		this.city = null;
		let citiesUrl = `${environment.sellerCRMApi}api/Customer/GetCities/?parentCode=${province}`;
		this.sub4=this.auth.get(citiesUrl).subscribe((res)=>{
			let result=res.json();
            this.cities = result;
		});
	}
	

	public invoiceTypes: Array<{ name: string, code: number }> = [
        { name: "应用购买", code: 1 }
    ];
    invoiceTypePlaceHolder:{ name: any, code: number } = { name: "请选择发票内容", code: null };
    public invoiceType = 1;
    public provinceDetail: any;
    public city:any;

    private postData = {
    	"invoice":{
		    "invoiceType": 0,
		    "title": "string",
		    "amount": 0,
		    "contactPerson": "string",
		    "contact": "string",
		    "areaCode": {
		      "proviceCode": 0,
		      "cityCode": 0
		    },
		    "address": "string",
    	},
	    "sellerName":''
	}
	private opened = false;
	orderId:any;
	
    onSubmit(m){
    	if(!m.valid) {
    		alert('请完善必填信息');
    		return;
    	}
    	this.postData.invoice.areaCode.proviceCode = this.provinceDetail;
    	this.postData.invoice.areaCode.cityCode = this.city;
    	this.postData.sellerName = this.sellerName;
    	for(let k in m.value){
    		if(k != "provinceDetail"&&k != "city"&&k!='sellerName'){
    			this.postData.invoice[k] = m.value[k];
    		}
    	}
    	this.sub5=this.auth.post(`${environment.appStoreApi}api/CartStep2`,this.postData).subscribe((res)=>{
    		let result = res.json();
    		this.orderId = result.orderId;
    		if(result.result == 2) {
    			this.router.navigate(['/store/cart/third',result.orderId]);
    		}else if(result.result == 1){
    			this.opened = true;
    		}else if(result.result == 0) {
    			// code...
    			this.errorDialog = true;
    			this.errorContent = result.message;
    		}
    	})
    }
    close(){
    	this.opened = false;
    }

    errorDialog:boolean = false;
    errorContent:string;
    errorClose(){
    	this.errorDialog = false;
    }

	ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
		if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe();}
        if (this.sub4 !== undefined && this.sub4 !== null) { this.sub4.unsubscribe();}
		if (this.sub5 !== undefined && this.sub5 !== null) { this.sub5.unsubscribe();}
    }
}