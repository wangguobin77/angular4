import { Component, OnInit,ViewEncapsulation ,OnDestroy} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { State } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import{ environment } from '../../../../../../environments/environment';
import { AuthHttpService } from '../../../../../+common/services/auth-http.service';
import {SelectContractService} from './select.service'
import { Http } from '@angular/http';
import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';
@Component({
    selector: 'select-contract',
    templateUrl: './selectContract.component.html',
    styleUrls:['./selectContract.scss']
})
export class SelectContract implements OnDestroy{
    sub1;sub2;
	private gridData = [];
    public dataFilter = {};
    private searchContent:string;
    private allChecked:boolean = false;//全选控制
    private isBid:boolean = true;
    eleUsedTypePlaceHolder = { name: "请选择用电类型", value: null };
    eleUsedTypeData:Array<{name:string,value:number}> = [
        {name:"山西交易中心",value:14}
    ]
    public eleUsedType: { name: string, value: number };
	constructor(private auth: AuthHttpService, private http:Http,private service:SelectContractService,private router:Router) {
    }
    searchContract(){
    	this.service.dataFilter.name = this.searchContent;
    	this.searchPost();
    }
    searchPost(){
		this.dataFilter = this.service.dataFilter;
		 
        this.sub1=this.auth.post(`${environment.sellerEnergyPurchaseApi}api/SXPurchasePlan/GetContactUseList`,this.dataFilter).subscribe((res)=>{
        	console.log(res);
        	let result = res.json();
        	for(let k of result){
        		k.isChecked = false;
        	}
        	this.gridData = result;
        })
    }
    m:number = 0;
    private totleCount:number = 0;
    private details =[];
    onChange(){
    	this.m = 0;
    	for(let k of this.gridData){
    		if(!k.isChecked) {
    			this.m += 1;
    		}
    	}
    	if(this.m > 0){
    		this.allChecked = false;
    	}else{
    		this.allChecked = true;
    	}
    	this.countTotle();
    }
    onAllChange(e){
    	if(e){
    		for(let k of this.gridData){
    			k.isChecked = true;
    		}
    	}else{
    		for(let k of this.gridData){
    			k.isChecked = false;
    		}
    	}
    	this.countTotle();
    }
    countTotle(){
    	this.totleCount = 0;
        this.details = [];
    	for(let k of this.gridData){
    		if(k.isChecked) {
                console.log(k);
    			this.totleCount += k.dAmount; 
                this.details.push({contractId:k.contractId,amount:k.dAmount});
    		}
    	}
    }
    submitTotleCount(){
          
    	this.service.setTotelCount(this.totleCount, this.details);
    	this.router.navigate(['/purchase/plan/shanxi/create']);
    }
    ngOnInit(){
    	this.searchPost();
    	this.totleCount = this.service.totleCount;
    }

    private postValue = {
        user:"",
        message:"",
        year:0,
        month:0
    }
    remindToDeclare(m){
        this.postValue.user = m.subjectName;
        this.postValue.message = m.contractName;
        this.postValue.year = this.service.dataFilter.planYear;
        this.postValue.month = this.service.dataFilter.planMonth;
        this.sub2=this.auth.post(`${environment.sellerEnergyPurchaseApi}api/CommonPurchase/SendMessage`,this.postValue).subscribe((res)=>{
            console.log(res);
            let result = res.json();
            if(result.result){
                this.opened = true;
            }
        })
    }
    private opened = false;
    close(){
        this.opened = false;
    }
        ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
    }
}