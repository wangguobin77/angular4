import { Component, OnInit,ViewEncapsulation,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../+common/services/auth.service';
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
    private radioChecked:boolean;
    private engineK:boolean = true;
    constructor(
        private router: Router,
        private authService: AuthService, 
        private auth: AuthHttpService,
        private http: Http,
        private formBuilder: FormBuilder,
        private sContract:SelectContractService) {
        this.difEnd = sContract.totleCount;
        this.radioChecked = sContract.radioChecked;
        this.planName = sContract.planName;
        this.tradingCenter = sContract.tradingCenter;
        this.remark = sContract.remark;
        this.selectTime = sContract.time;
        this.details = sContract.details;
    }
    private planName:string;
    tradingCenterPlaceHolder = { name: "请选择交易中心", value: null };
    tradingCenterData:Array<{name:string,value:number}> = [
        {name:"安徽交易中心",value:34}
    ]
    public tradingCenter: number = 0;
    private difEnd:number = 0;
    private details=[];
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
            detail:this.details,
            name:m.value.planName,
            tradeCenterId: this.tradingCenter,
            duration: kendo.toString(this.selectTime,"yyyy/MM/01"),
            type:this.radioChecked?1:2,
            dAmount:this.difEnd,
            remark:m.value.remark};
        
        if(postValue.type==1) {
            postValue.duration = kendo.toString(this.selectTime,"yyyy/01/01");
        }
       
        this.sub1=this.auth.post(`${environment.sellerEnergyPurchaseApi}api/AHPurchasePlan/Add`,postValue)
        .subscribe((res)=>{
            let result = res.json();
            if(result.result){
                this.difEnd = this.sContract.totleCount = null;
                this.radioChecked = this.sContract.radioChecked = null;
                this.planName = this.sContract.planName = null;
                this.tradingCenter = this.sContract.tradingCenter = null;
                this.remark = this.sContract.remark = null;
                this.selectTime = this.sContract.time = null;
                this.details = this.sContract.details = null;
                this.router.navigate(['/purchase/plan/anhui/list']);
            }else{
                alert(result.message);
            }
            console.log(result);
        })
    }

    model = {
        options:false
    }
    setSelectDepth(n){
        this.radioChecked = n;
        this.selectTimeK = true;
        if(n){
            if(this.datepicker.value() == null){
                this.timeSelected = false;
            }else{
                this.timeSelected = true;
                this.selectTime = this.datepicker.value();
            }
        }else{
            if(this.datepickerMonth.value() == null){
                this.timeSelected = false;
            }else{
                this.timeSelected = true;
                this.selectTime = this.datepickerMonth.value();
            }
        }
        this.sContract.setRadioChecked(n);
    }
    private yearValue:Date;
    private monthValue:Date;
    datepicker = {value:function() {}};
    datepickerMonth = {value:function() {}};
    ngOnInit(){
        var _this = this;
        var setSelectTimeK=()=>{ 
            _this.timeSelected = true;
            if(_this.radioChecked) {
                if(_this.datepicker.value() == null){
                    _this.selectTimeK = false;
                }else{
                    _this.selectTimeK = true;
                    _this.selectTime = _this.datepicker.value();
                }
            }else{
                if(_this.datepickerMonth.value() == null){
                    _this.selectTimeK = false;
                }else{
                    _this.selectTimeK = true;
                    _this.selectTime = _this.datepickerMonth.value();
                }
            }
        }
        $("#datepickerMonth").kendoDatePicker({
            start: "year",
            depth: "year",
            format: "yyyy MM",
            change:setSelectTimeK
        });
        $("#datepicker").kendoDatePicker({
            start: "decade",
            depth: "decade",
            format: "yyyy",
            change:setSelectTimeK
        });
        this.datepicker = $("#datepicker").data("kendoDatePicker");
        this.datepickerMonth = $("#datepickerMonth").data("kendoDatePicker");
        if(this.sContract.time == undefined||this.sContract.time == null)return;
        if(this.sContract.time != null&&this.sContract.time !=undefined&&this.sContract.time != "") {
            this.timeSelected = true;
        }
        if(this.radioChecked) {
            $("#datepicker").data("kendoDatePicker").value(this.sContract.time);
        }else{
            $("#datepickerMonth").data("kendoDatePicker").value(this.sContract.time);
        }
    }
    selectContract(){
        if(this.timeSelected){
            this.sContract.setValue(this.planName,this.remark,this.tradingCenter);
            this.selectTimeK = true;
            let contactType = this.radioChecked?1:2;
            let time = this.radioChecked?this.datepicker.value():this.datepickerMonth.value();
            this.sContract.setData(contactType,time,this.radioChecked);
            this.router.navigate(['/purchase/plan/anhui/create/selectContract']);
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