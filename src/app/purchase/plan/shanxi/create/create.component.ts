import { Component, OnInit,ViewEncapsulation,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import{ environment } from '../../../../../environments/environment';
import {SelectContractService} from './selectContract/select.service';

import {
    FormGroup,
    FormControl,
    FormBuilder
} from '@angular/forms';

declare var $:any;
declare var kendo:any;

@Component({
    // encapsulation: ViewEncapsulation.None,
    selector: 'create',
    templateUrl: './create.html',
    styleUrls: ['./create.css']
})
export class CreateComponent implements OnDestroy{
    sub1;
    public form: FormGroup;
    private engineK:boolean = true;
    constructor(
        private router: Router,
        private auth: AuthHttpService, 
        private http: Http,
        private formBuilder: FormBuilder,
        private sContract:SelectContractService) {
        this.difEnd = sContract.totleCount;
        this.planName = sContract.planName;
        this.tradingCenter = sContract.tradingCenter;
        this.remark = sContract.remark;
        this.selectTime = sContract.time;
        this.detail = sContract.detail;
    }
    private planName:string;
    contactType = 2;//采购方式 竞价
    tradingCenterPlaceHolder = { name: "请选择交易中心", value: null };
    tradingCenterData:Array<{name:string,value:number}> = [
        {name:"山西交易中心",value:14}
    ]
    public tradingCenter: number = 0;
    private difEnd:number = 0;
    private detail=[];
    private selectTime:any;
    public min: Date = new Date(1917, 0, 1);
    public max: Date = new Date(2050, 12, 31);
    private remark:string;
    private engine:string;
    private selectDepth:boolean = false;
    private selectTimeK:boolean = true;
    private timeSelected:boolean = false;
    submit(e,m){
         
        if(this.selectTime == undefined||this.selectTime == null){
            this.timeSelected = false;
            return;
        };
        if(this.tradingCenter < 1){
            return;
        }
        let postValue = {
            detail:this.detail,
            name:m.value.planName,
            tradeCenterId: this.tradingCenter,
            duration:kendo.toString(this.selectTime,"yyyy/MM/01"),
            type:this.contactType,
            dAmount:this.difEnd,
            remark:m.value.remark};
        
        if(postValue.type==1) {
            postValue.duration = kendo.toString(this.selectTime,"yyyy/01/01");
        }
        
        this.sub1=this.auth.post(`${environment.sellerEnergyPurchaseApi}api/SXPurchasePlan/Add`,postValue)
        .subscribe((res)=>{
            let result = res.json();
            if(result.result){
                this.difEnd = this.sContract.totleCount = null;
                this.planName = this.sContract.planName = null;
                this.tradingCenter = this.sContract.tradingCenter = null;
                this.remark = this.sContract.remark = null;
                this.selectTime = this.sContract.time = null;
                this.router.navigate(['/purchase/plan/shanxi/list']);
            }else{
                alert(result.message);
            }
            console.log(result);
        })
    }

    model = {
        options:false
    }
    
    private yearValue:Date;
    private monthValue:Date;
    datepicker = {value:function() {}};
    datepickerMonth = {value:function() {}};
    ngOnInit(){
        var _this = this;
        var setSelectTimeK=()=>{ 
            _this.timeSelected = true;
                if(_this.datepickerMonth.value() == null){
                    _this.selectTimeK = false;
                }else{
                    _this.selectTimeK = true;
                    _this.selectTime = _this.datepickerMonth.value();
                }
            
        }
        $("#datepickerMonth").kendoDatePicker({
            start: "year",
            depth: "year",
            format: "yyyy MM",
            change:setSelectTimeK
        });
        
       
        this.datepickerMonth = $("#datepickerMonth").data("kendoDatePicker");
        if(this.sContract.time == undefined||this.sContract.time == null)return;
        if(this.sContract.time != null&&this.sContract.time !=undefined&&this.sContract.time != "") {
            this.timeSelected = true;
        }
        $("#datepickerMonth").data("kendoDatePicker").value(this.sContract.time);
    }
    selectContract(){
        if(this.timeSelected){
            this.sContract.setValue(this.planName,this.remark,this.tradingCenter);
            this.selectTimeK = true;
            this.sContract.setData(this.contactType,this.datepickerMonth.value());
            this.router.navigate(['/purchase/plan/shanxi/create/selectContract']);
        }else{
            if(!this.timeSelected){
                this.selectTimeK = false;
            }
        }
    }
        ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
    }
}