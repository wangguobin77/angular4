import { Component, OnInit, ViewEncapsulation,OnDestroy } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../+common/services/auth.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { environment } from '../../../../../environments/environment';

import {
    FormGroup,
    FormControl
} from '@angular/forms';

declare var $: any;
declare var kendo: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'edit',
    templateUrl: './edit.html',
    styleUrls: ['./edit.css']
})
export class EditComponent implements OnDestroy {
    sub1;sub2;sub3;sub4;sub5;sub6;sub7;sub8;sub9;sub10;sub11;sub12;sub13;
    constructor(private router: Router, private authService: AuthService, private http: Http, private route: ActivatedRoute)
    {
        
    }
    
    //数据双向绑定
    model = {
        customer: {
            Id: 0,
            //SellerId: null,
            SubjectName: null,
            SellerSubjectId: null,
            TradingCenterId: 0,
            IndustryCategoryFirstId: null,
            IndustryCategorySecondId: null,
            LegalPerson: null,
            UsedPowerType: null,
            Province: null,
            City: null,
            Address: null,
            RegisterManagePlace: null,
            TaxNumber: null,
            VoltageLevel: null,
            Capacitance: null,
            TransformerCapability: null,
            ElectricityAmount: null,
            AptitudeCode: null,
            Source: 0,
            TransferSaleId: null,
            CustomerLevel: null
        },
        contract: {
            Id:null,
            ContractName: null,
            ContractNumber: null,
            StartDate: null,
            EndDate: null,
            ContractType: 1,
        },
        plan: {
            PlansCount:null
        }
    };

    //控件数据绑定
    mdata = {
        customer:{
            data:[],
            filter:(name)=>{
                let the =this.mdata.customer;
                this.sub1=this.authService.AuthGet(`${environment.sellerContractApi}api/GDContract/GetSubjectList/${name}`).subscribe((res)=> {
                    the.data = res.json();
                });
            },
            change:()=>{
                let id = this.model.customer.Id;
                if (id==0) return;
                this.sub2=this.authService.AuthGet(`${environment.sellerContractApi}api/GDContract/${id}`).subscribe((res)=> {
                    let data = res.json();

                    if (data != null) {
                        this.model.customer = data;
                        this.model.customer.SellerSubjectId=id;
                        this.mdata.area.change();
                        this.mdata.industry.change();
                        this.model.customer.City=data.City;
this.model.customer.IndustryCategorySecondId=data.IndustryCategorySecondId;
                    }
                });
            }
        },
        UsedPowerTypes: [
            { text: "一般工商业用电", value: 2 },
            { text: "大工业用电", value: 1 },
            { text: "居民生活用电", value: 3 },
            { text: "农业生产用电", value: 4 }
        ],
        area: {
            provinces: [],
            cities: [],
            init: () => {
                var the = this.mdata.area;
                this.sub3=this.authService.AuthGet(`${environment.sellerContractApi}api/Common/GetCities/1`).subscribe((res) => {
                    the.provinces = res.json();
                });
            },
            change: () => {
                var the = this.mdata.area;
                var pcode = this.model.customer.Province;

                this.model.customer.City = null;
                the.cities = [];
                
                if (pcode == null) {
                    return;
                }
                this.sub4=this.authService.AuthGet(`${environment.sellerContractApi}api/Common/GetCities/${pcode}`).subscribe((res) => {
                    the.cities = res.json();
                });
            }
        },
        industry: {
            firs: [],
            secs: [],
            init: () => {
                var the = this.mdata.industry;
                this.sub5=this.authService.AuthGet(`${environment.sellerContractApi}api/Common/GetIndustryCategory/0`).subscribe((res) => {
                    the.firs = res.json();
                });
            },
            change: () => {
                var the = this.mdata.industry;
                var id = this.model.customer.IndustryCategoryFirstId;

                this.model.customer.IndustryCategorySecondId = null;
                the.secs = [];

                if (id == null) {
                    return;
                }
                this.sub6=this.authService.AuthGet(`${environment.sellerContractApi}api/Common/GetIndustryCategory/${id}`).subscribe((res) => {
                    the.secs = res.json();
                });
            }
        },
        voltage: {
            data: [],
            init: () => {
                var the = this.mdata.voltage;
                this.sub7=this.authService.AuthGet(`${environment.sellerContractApi}api/Common/GetDics/VoltageLevel`).subscribe(function (res) {
                    the.data = res.json();
                });
            }
        },
        contractType:{
            data:[ 
                { text: "长协", value: 1 },
                { text: "竞价", value: 2 }
                ],
            change:()=>{
                this.plans.init();
            }
        }
    };

    //合约分解
    plans={
        valid:{
            pass:false,
            msg:"",
            check:()=>{
                let the = this.plans;
                if(this.model.contract.ContractType==2) {
                    the.valid.pass = true;
                    return true;
                }
                if(this.model.plan.PlansCount==null){
                    the.valid.msg="下面表格长协电量必填，竞价电量选填";
                    the.valid.pass = false;
                    return false;
                }
                let sum = 0;
                for(let item of the.data){
                    sum+=(item.longAmount==null?0:item.longAmount);
                }
                if(sum!=this.model.plan.PlansCount){
                    the.valid.msg="下面表格长协电量输入的总和必须等于总预购电量";
                    the.valid.pass = false;
                    return false;
                }
                the.valid.pass = true;
                return true;
            }
        },
        data:[],
        getMonthNumber:(date1, date2)=> {
            date1 = date1.replace(/\//g, "");
            date2 = date2.replace(/\//g, "");
            //默认格式为"20030303"
            let year1 = date1.substr(0, 4);
            let year2 = date2.substr(0, 4);
            let month1 = date1.substr(4, 2);
            let month2 = date2.substr(4, 2);
            let len = (year2 - year1) * 12 + (month2 - month1);
            return len;
        },
        init:()=>{
            let the = this.plans;
            let contract = this.model.contract;
            the.data=[];

            if (contract.StartDate== null || contract.EndDate == null) return;

            let start = kendo.toString(contract.StartDate, "yyyy/MM/dd");
            let end = kendo.toString(contract.EndDate, "yyyy/MM/dd");
            let months = the.getMonthNumber(start,end); //相差月份

            for (let i = 0; i < months; i++) {

                let startDate = kendo.parseDate(start);
                
                let startStr = kendo.toString(startDate, "yyyy/MM");

                the.data.push({
                    planYear:startDate.getFullYear(),
                    planMonth:startDate.getMonth()+1,
                    date:startStr,
                    bidAmount:null,
                    longAmount:null
                });

                startDate.setMonth(startDate.getMonth() + 1);
            }
        }
    };

    //套餐选择
    packages = {
        data: [],
        types:[],
        guarantees: [],
        fixs: [],
        markets: [],
        bids: [],
        isMarket: true,
        value:null,
        doActive: (type) => {
            let the = this.packages;
            let types = [];

            if (type.metaType == 4 && !the.isMarket) {
                return false;
            }
            else if (type.metaType == 5 && the.isMarket) {
                return false;
            }

            if (type.metaType == 1) types = the.guarantees;
            else if (type.metaType == 2) types = the.fixs;
            else if (type.metaType == 4) types = the.markets;
            else if (type.metaType == 5) types = the.bids;

            for (let g of types) {
                if (g.id == type.id) {
                    if (g.isActive) g.isActive = false;
                    else g.isActive = true;
                }
                else {
                    g.isActive = false;
                }
            }
            return true;
        },
        switchRate: (i) => {
            let the = this.packages;
            the.isMarket = (i == 1);

            if (the.isMarket) {
                for (let g of the.bids) {
                    g.isActive = false;
                }
            }
            else {
                for (let g of the.markets) {
                    g.isActive = false;
                }
            }
            
        },
        getRequest: () => {
            let the = this.packages;
            let ids = [];
            for (let item of the.guarantees) {
                if (item.isActive) {
                    ids.push(item.id);
                    break;
                }
            }
            for (let item of the.fixs) {
                if (item.isActive) {
                    ids.push(item.id);
                    break;
                }
            }
            if (the.isMarket) {
                for (let item of the.markets) {
                    if (item.isActive) {
                        ids.push(item.id);
                        break;
                    }
                }
            }
            else {
                for (let item of the.bids) {
                    if (item.isActive) {
                        ids.push(item.id);
                        break;
                    }
                }
            }

            if (ids.length == 0) return null;

            let request = {
                contractType: this.model.contract.ContractType,
                priceSetMetaOne: "",
                priceSetMetaTwo: "",
                priceSetMetaThree: ""
            };

            request.priceSetMetaOne = ids[0];

            if (ids.length == 2) {
                request.priceSetMetaTwo = ids[1];
            }
            else if (ids.length == 3) {
                request.priceSetMetaTwo = ids[1];
                request.priceSetMetaThree = ids[2];
            }

            return request;
             
        },
        selectType: (type) => {
            let the = this.packages;
            let flag = the.doActive(type);
            if (!flag) return;

            let req = the.getRequest();

            the.data = [];
            this.packageExtends.disabled();
            this.packageSettles.disabled();

            if (req != null) {
                this.sub8=this.authService.AuthPost(`${environment.sellerContractApi}api/Common/GetSubPackage`, req).subscribe((res) => {
                    the.data = res.json();
                });
            }
        },
        select: (item) => {
            let the = this.packages;
            let isEmpty = false;

            the.value = item;

            for (let g of the.data) {
                if (g.id == item.id) {
                    if (g.isActive) {
                        g.isActive = false;
                        isEmpty = true;
                    }
                    else g.isActive = true;
                }
                else {
                    g.isActive = false;
                }
            }
            this.packageExtends.disabled();
            this.packageSettles.disabled();

            for (let extend of item.relatedMetas) {
                if (extend.metaType == 1) {
                    this.packageSettles.guarantees.disabled = false;
                }
                else if (extend.metaType == 2) {
                    this.packageSettles.fixs.disabled = false;
                }
                else if (extend.metaType == 4) {
                    this.packageSettles.rates.disabled = false;
                }
                else if (extend.metaType == 5) {
                    this.packageSettles.rates.disabled = false;
                }
                else if (extend.metaType == 6) {
                    this.packageExtends.maxQ.disabled = false;
                }
                else if (extend.metaType == 7) {
                    this.packageExtends.minQ.disabled = false;
                }
                else if (extend.metaType == 8) {
                    this.packageExtends.compQ.disabled = false;
                }
            }
        },
        clear: () => {
            let the = this.packages;
            the.guarantees = [];
            the.fixs = [];
            the.markets = [];
            the.bids = [];
            the.data = [];
        },
        init:()=>{
            this.packages.clear();
            this.packageExtends.disabled();
            this.packageSettles.disabled();

            let contractType = this.model.contract.ContractType;
            this.sub9=this.authService.AuthGet(`${environment.sellerContractApi}api/Common/GetMetaPackage/${contractType}`).subscribe((res) => {
                let types = res.json();

                this.packages.types = types;
                
                for (let t of types) {
                    if (t.metaType == 1) {
                        this.packages.guarantees.push(t);
                    }
                    else if (t.metaType == 2) {
                        this.packages.fixs.push(t);
                    }
                    else if (t.metaType == 4) {
                        this.packages.markets.push(t);
                    }
                    else if (t.metaType == 5) {
                        this.packages.bids.push(t);
                    }
                }
            });
        }
    };
    //扩展选择
    packageExtends = {
        maxQ: {
            id:"08A0F6BD-1978-4F38-A44B-EFC3C5D790B1",
            disabled: true,
            checked: false,
            value:null,
            change: () => {
                let the = this.packageExtends;
            }
        },
        minQ: {
            id:"5AEEC840-56F2-4FEE-A930-0B0BA55B847C",
            disabled: true,
            checked: false,
            value:null,
            change: () => {
                let the = this.packageExtends;
            }
        },
        compQ: {
            id:"C83C44A6-CA2A-4F74-926D-07E950F9593E",
            disabled: true,
            checked: false,
            value:null,
            change: () => {
                let the = this.packageExtends;
            }
        },
        disabled: () => {
            let the = this.packageExtends;
            the.maxQ.disabled = true;
            the.minQ.disabled = true;
            the.compQ.disabled = true;
        }
    };
    //结算选择
    packageSettles = {
        isPrice:true,
        switch: (i) => {
            let the = this.packageSettles;
            the.isPrice = (i == 1);
        },
        guarantees: {
            disabled: true,
            items: [{
                min:null,
                max:null,
                price:null
            }],
            add: () => {
                let the = this.packageSettles.guarantees;
                the.items.push({
                    min:null,
                    max:null,
                    price:null
                });
            },
            remove: (index) => {
                let the = this.packageSettles.guarantees;
                the.items.splice(index, 1);
            }
        },
        fixs: {
            disabled: true,
            items: [{
                min:null,
                max:null,
                price:null
            }],
            add: () => {
                let the = this.packageSettles.fixs;
                the.items.push({
                    min:null,
                    max:null,
                    price:null
                });
            },
            remove: (index) => {
                let the = this.packageSettles.fixs;
                the.items.splice(index, 1);
            }
        },
        rates: {
            disabled: true,
            items: [{
                min:null,
                max:null,
                price:null
            }],
            add: () => {
                let the = this.packageSettles.rates;
                the.items.push({
                    min:null,
                    max:null,
                    price:null
                });
            },
            remove: (index) => {
                let the = this.packageSettles.rates;
                the.items.splice(index, 1);
            }
        },
        disabled: () => {
            let the = this.packageSettles;
            the.guarantees.disabled = true;
            the.fixs.disabled = true;
            the.rates.disabled = true;
        }
    };
    //偏差担保
    offsets = {
        ways: [
            { text: "不承担偏差", value: "0" },
            { text: "百分比价差补偿", value: "AF77DE64-1D95-4231-B303-31619D230DB4" },
            { text: "电量价差补偿", value: "3E19EDBC-EF2F-4345-99F6-AF7D2729A235" },
            { text: "百分惩罚分摊", value: "873D66ED-3123-43FA-BD96-4819D0097304" },
            { text: "电量惩罚分摊", value: "5B0CA548-C78F-409C-88B7-DC971E4CFF89" },
            //{ text: "担保偏差电量", value: "5" }
        ],
        currentWay: '0',
        bao:{id:"8B597FC3-E957-4A4C-BD2E-A11B3C4B2B59",value:null},
        items: [],
        types: {
            none: true,     //不承担偏差
            offset: false,  //是否偏差百分比true（考核电量false）
            fill: false,    //是否补偿true（惩罚false）
            bao: false      //担保偏差电量
        },
        swidth: () => {
            let the = this.offsets;

            the.items = [];

            if (the.currentWay == "0") {
                the.types.none = true;
            }
            else {
                the.types.none = false;
                the.items.push({
                    min:null,
                    max:null,
                    price:null
                });
            }
            if (the.currentWay == "AF77DE64-1D95-4231-B303-31619D230DB4") {
                the.types.offset = true;
                the.types.fill = true;
            }
            else if (the.currentWay == "3E19EDBC-EF2F-4345-99F6-AF7D2729A235") {
                the.types.offset = false;
                the.types.fill = true;
            }
            else if (the.currentWay == "873D66ED-3123-43FA-BD96-4819D0097304") {
                the.types.offset = true;
                the.types.fill = false;
            }
            else if (the.currentWay == "5B0CA548-C78F-409C-88B7-DC971E4CFF89") {
                the.types.offset = false;
                the.types.fill = false;
            }
            if (the.currentWay == "5") {
                the.types.offset = false;
                the.types.bao = true;
            }
            else {
                the.types.bao = false;
            }
        },
        add: () => {
            let the = this.offsets;
            the.items.push({
                min:null,
                max:null,
                price:null
            });
        },
        remove: (index) => {
            let the = this.offsets;
            the.items.splice(index, 1);
        },

    };
    //单方协议
    agreements = {
        amount:null,
        price:null,
        isFixed: true,
        switch: (i) => {
            let the = this.agreements;
            the.isFixed = (i == 1);
        }
    };

    //套餐数据
    packageModel = {
        data:{
            setId: 0,
            settleType: 0,
            metaValues: [
                {
                    id: null,
                    dataValueType: 1,
                    dataValueUnitType: 1,
                    setData: [
                        {
                        minValue: 0,
                        maxValue: 0,
                        dataValue: 0
                        }
                    ]
                }
            ]
        },
        request:()=>{
            let the=this.packageModel.data;
            let item = this.packages.value;
            
            the.setId = item.id
            the.settleType = this.packageSettles.isPrice?1:2;
            the.metaValues=[];

            //结算
            for(let meta of item.relatedMetas){
                let data;
                let unit = the.settleType;
                let sets = [];
                if(meta.metaType==1){
                    data = this.packageSettles.guarantees;
                }
                else if(meta.metaType==2){
                    data = this.packageSettles.fixs;
                }
                else if(meta.metaType==4 || meta.metaType==5){
                    data = this.packageSettles.rates;
                    unit=4;
                }
                else{
                    continue;
                }
                for(let value of data.items){
                    sets.push({
                        minValue: value.min,
                        maxValue: value.max,
                        dataValue: value.price
                        });
                }
                the.metaValues.push({
                    id:meta.id,
                    dataValueType:meta.dataValueType,
                    dataValueUnitType:unit, // 按价格:1 按价差: 2 按电量:3 按万分比:4
                    setData: sets
                });
            }

            //扩展
            if(this.packageExtends.maxQ.value!=null){
                the.metaValues.push({
                    id:this.packageExtends.maxQ.id,  //下限电量
                    dataValueType:2,
                    dataValueUnitType:3, 
                    setData: [{
                        minValue: null,
                        maxValue: null,
                        dataValue: this.packageExtends.maxQ.value
                    }]
                });
            }
            if(this.packageExtends.minQ.value!=null){
                the.metaValues.push({
                    id:this.packageExtends.minQ.id,
                    dataValueType:2,
                    dataValueUnitType:1, 
                    setData: [{
                        minValue: null,
                        maxValue: null,
                        dataValue: this.packageExtends.minQ.value //上限收益
                    }]
                });
            }
            if(this.packageExtends.compQ.value!=null){    //赔偿收益
                the.metaValues.push({
                    id:this.packageExtends.compQ.id,
                    dataValueType:2,
                    dataValueUnitType:1, 
                    setData: [{
                        minValue: null,
                        maxValue: null,
                        dataValue: this.packageExtends.compQ.value
                    }]
                });
            }

            //偏差电量担保
            if(this.offsets.currentWay!="0"){
                let sets=[];
                for(let value of this.offsets.items){
                    sets.push({
                        minValue: value.min,
                        maxValue: value.max,
                        dataValue: value.price
                        });
                }
                the.metaValues.push({
                    id:this.offsets.currentWay,
                    dataValueType:3,
                    dataValueUnitType:this.offsets.types.fill?1:4, // 按价格:1 按价差: 2 按电量:3 按万分比:4
                    setData: sets
                });        
                //担保最大金额
                the.metaValues.push({
                    id:this.offsets.bao.id,
                    dataValueType:1,
                    dataValueUnitType:1, // 按价格:1 按价差: 2 按电量:3 按万分比:4
                    setData: [{
                            minValue: null,
                            maxValue: null,
                            dataValue: this.offsets.bao.value
                        }]
                });
            }


        }
    };

    //提交
    submit(e) {
        e.preventDefault();
        
        let the = this;
        let contractType = the.model.contract.ContractType;

        if(the.packages.value==null){
            alert("请选择一个套餐");
            return;
        }

        //用电主体
        let customer=the.model.customer;
        let industryCategoryName = "";
        for(let item of the.mdata.industry.firs){
            if(customer.IndustryCategoryFirstId==item.id){
                industryCategoryName = item.categoryName;
                break;
            }
        }
        for(let item of the.mdata.industry.secs){
            if(customer.IndustryCategorySecondId==item.id){
                industryCategoryName = `${industryCategoryName}/${item.categoryName}`;
                break;
            }
        }
        let cityName = "";
        for(let item of the.mdata.area.provinces){
            if(customer.Province==item.code){
                cityName = item.name;
                break;
            }
        }
        for(let item of the.mdata.area.cities){
            if(customer.City==item.code){
                cityName = `${cityName},${item.name}`;
                break;
            }
        }
        let subject = {
            subjectName: customer.SubjectName,
            tradingCenterId: 34,
            industryCategory: `${customer.IndustryCategoryFirstId},${customer.IndustryCategorySecondId}`,
            industryCategoryName: industryCategoryName,
            legalPerson: customer.LegalPerson,
            usedPowerType: customer.UsedPowerType,
            city: `${customer.Province},${customer.City}`,
            cityName: cityName,
            address: customer.Address,
            registerManagePlace: customer.RegisterManagePlace,
            taxNumber: customer.TaxNumber,
            voltageLevel: customer.VoltageLevel,
            capacitance: customer.Capacitance,
            transformerCapability: customer.TransformerCapability
        }

        //合约信息
        let theContract = the.model.contract;
        let contract = {
            id:theContract.Id,
            sellerSubjectId:customer.SellerSubjectId,
            contractNo: theContract.ContractNumber,
            name: theContract.ContractName,
            beginDate: theContract.StartDate,
            endDate: theContract.EndDate,
            contractType: contractType,
            plansCount: the.model.plan.PlansCount,
            compensateAmount: the.agreements.isFixed? 0:the.agreements.amount,
            compensatePrice: the.agreements.isFixed?the.agreements.price:0,
            packageId: 0
        };

        //附件
        var $imgs = $("#products .product>img");
        var attachs = [];
        $imgs.each(function () {
            attachs.push({fileDataId:this.id});
        });
       
        //套餐请求
        the.packageModel.request();
        this.sub10=the.authService.AuthPost(`${environment.sellerContractApi}api/Common/SubmitPackageData`, the.packageModel.data).subscribe((res)=> {
            let packageId = res.json().Id;

            contract.packageId = packageId;

            //请求参数
            var request = {
                contract:contract,
                contractPlans:the.plans.data,
                contractSubject:subject,
                contractAttachments:attachs
            };

            this.sub11=the.authService.AuthPost(`${environment.sellerContractApi}api/GDContract/AddOrUpdateContract`, request).subscribe((msg)=> {
                //let msg = res.json();
                //alert(msg.);
                the.router.navigate(['/sale/contracts/guangdong/list']);
            });
        });
    }
    
    
    ngOnInit() {

        

        this.mdata.area.init();
        this.mdata.industry.init();
        this.mdata.voltage.init();
        this.packages.init();

        //绑定数据
        let id = this.route.snapshot.params['id'];
        this.sub12=this.authService.AuthGet(`${environment.sellerContractApi}api/GDContract/GetContractDetail/${id}`).subscribe((res) =>{
            let m = res.json();
            let the = this.model;

            let subject = m.contractSubject;
            let contract = m.contracts;

            let industryCategorys = subject.industryCategory.split(",");
            let citys = subject.city.split(",");

            this.mdata.customer.data.push({
                Id:subject.id,
                SubjectName:subject.subjectName
            });

            //用电主体
            the.customer={
                Id: subject.id,
                SubjectName: subject.subjectName,
                SellerSubjectId: contract.sellerSubjectId,
                TradingCenterId: 34,
                IndustryCategoryFirstId: parseInt(industryCategorys[0]),
                IndustryCategorySecondId: parseInt(industryCategorys[1]),
                LegalPerson: subject.legalPerson,
                UsedPowerType: subject.usedPowerType,
                Province: citys[0],
                City: citys[1],
                Address: subject.address,
                RegisterManagePlace: subject.registerManagePlace,
                TaxNumber: subject.taxNumber,
                VoltageLevel: subject.voltageLevel.toString(),
                Capacitance: subject.capacitance,
                TransformerCapability: subject.transformerCapability,
                ElectricityAmount: null,
                AptitudeCode: null,
                Source: 0,
                TransferSaleId: null,
                CustomerLevel: null
            };
            this.mdata.industry.change();
            this.mdata.area.change();

            the.customer.IndustryCategorySecondId = parseInt(industryCategorys[1]);
            the.customer.City = citys[1];

            //合约信息
            the.contract={
                Id:contract.id,
                ContractName: contract.name,
                ContractNumber: contract.contractNo,
                StartDate: kendo.parseDate(contract.beginDate),
                EndDate:kendo.parseDate(contract.endDate),
                ContractType: contract.contractType
            };
            
            //合约分解
            the.plan={
                PlansCount:contract.plansCount
            };
            if(m.contractPlans!=null && m.contractPlans.length>0){
                for(let item of m.contractPlans){
                    var date = `${item.planYear}/${item.planMonth<10?("0"+item.planMonth):item.planMonth}`;
                    this.plans.data.push({
                        planYear:item.planYear,
                        planMonth:item.planMonth,
                        date:date,
                        bidAmount:item.bidAmount,
                        longAmount:item.longAmount
                    });
                }
            }

            //单方终止协议
            this.agreements.amount = contract.compensateAmount;
            this.agreements.price = contract.compensatePrice;
            this.agreements.isFixed = (contract.compensateAmount==0 || contract.compensateAmount==null);

            //合约文本
            if(m.contractAttachments!=null && m.contractAttachments.length>0){
                for(let item of m.contractAttachments){
                     $("<div class='product'><img src=" + environment.uploadRoot + item.src + " id=" + item.fileDataId + " /><i class='iconfont icon-guanbipsd'></i></div>").appendTo($("#products"));
                }
            }

            //套餐模块
            this.sub13=this.authService.AuthGet(`${environment.sellerContractApi}api/Common/SubmitPackageData/${contract.packageId}`).subscribe((pack) =>{
                let mpack = pack.json();

                //套餐选择
                this.packages.data.push(mpack.priceSet);
                this.packages.select(mpack.priceSet);

                //结算方式
                this.packageSettles.isPrice=(mpack.settleType==1);

                for(let item of mpack.priceSetMetaDetail){
                    //结算方式
                    if(item.metaType==1){
                        this.packageSettles.guarantees.items=[];
                        for(let value of item.setDataValue){
                            this.packageSettles.guarantees.items.push({
                                min:value.lowerBound,
                                max:value.upperBound,
                                price:value.dataValue
                            });
                        }
                    }
                    else if(item.metaType==2){
                        this.packageSettles.fixs.items=[];
                        for(let value of item.setDataValue){
                            this.packageSettles.fixs.items.push({
                                min:value.lowerBound,
                                max:value.upperBound,
                                price:value.dataValue
                            });
                        }
                    }
                    else if(item.metaType==4 || item.metaType==5){
                        this.packageSettles.rates.items=[];
                        for(let value of item.setDataValue){
                            this.packageSettles.rates.items.push({
                                min:value.lowerBound,
                                max:value.upperBound,
                                price:value.dataValue
                            });
                        }
                    }
                    //扩展选择
                    else if(item.id==this.packageExtends.maxQ.id){
                        this.packageExtends.maxQ.checked=true;
                        this.packageExtends.maxQ.value = item.setDataValue[0].dataValue;
                    }
                    else if(item.id==this.packageExtends.minQ.id){
                        this.packageExtends.minQ.checked=true;
                        this.packageExtends.minQ.value = item.setDataValue[0].dataValue;
                    }
                    else if(item.id==this.packageExtends.compQ.id){
                        this.packageExtends.compQ.checked=true;
                        this.packageExtends.compQ.value = item.setDataValue[0].dataValue;
                    }
                    //偏差电量担保
                    for(let offset of this.offsets.ways){
                        if(offset.value==item.id.toUpperCase()){
                            this.offsets.currentWay = item.id.toUpperCase();
                            this.offsets.swidth();
                            this.offsets.items=[];
                            for(let value of item.setDataValue){
                                this.offsets.items.push({
                                    min:value.lowerBound,
                                    max:value.upperBound,
                                    price:value.dataValue
                                });
                            }
                            break;
                        }
                    }
                    //担保最大金额
                    if(this.offsets.bao.id==item.id.toUpperCase()){
                        this.offsets.types.bao = true;
                        this.offsets.bao.value = item.setDataValue[0].dataValue;
                    }
                }
            });
        });

        //上传合约附件
        $("#files").kendoUpload({
            async: {
                saveUrl: `${environment.sellerContractApi}/api/Upload/Kendo_Image_Upload`,
                autoUpload: true
            },
            validation: {
                allowedExtensions: [".jpg", ".jpeg", ".png", ".bmp", ".gif"]
            },
            success: onSuccess,
            showFileList: false,
            dropZone: ".dropZoneElement"
        });

        function onSuccess(e) {
            if (e.operation == "upload") {
                for (var i = 0; i < e.files.length; i++) {
                    var file = e.files[i].rawFile;
                    if (file) {
                        var reader = new FileReader();
                        var fileId = e.response[i];
                        reader.onloadend = function () {
                            $("<div class='product'><img src=" + environment.uploadRoot + this.result + " id=" + fileId + " /><i class='iconfont icon-guanbipsd'></i></div>").appendTo($("#products"));
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
        }
        $(document).off("click", ".product i").on("click", ".product i", function () {
            $(this).parent().remove();
        });

    }
        ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe();}
        if (this.sub4 !== undefined && this.sub4 !== null) { this.sub4.unsubscribe();}
        if (this.sub5 !== undefined && this.sub5 !== null) { this.sub5.unsubscribe();}
        if (this.sub6 !== undefined && this.sub6 !== null) { this.sub6.unsubscribe();}
        if (this.sub7 !== undefined && this.sub7 !== null) { this.sub7.unsubscribe();}
        if (this.sub8 !== undefined && this.sub8 !== null) { this.sub8.unsubscribe();}
        if (this.sub9 !== undefined && this.sub9 !== null) { this.sub9.unsubscribe();}
        if (this.sub10 !== undefined && this.sub10 !== null) { this.sub10.unsubscribe();}
        if (this.sub11 !== undefined && this.sub11 !== null) { this.sub11.unsubscribe();}
        if (this.sub12 !== undefined && this.sub12 !== null) { this.sub12.unsubscribe();}
        if (this.sub13 !== undefined && this.sub13 !== null) { this.sub13.unsubscribe();}
    }
}