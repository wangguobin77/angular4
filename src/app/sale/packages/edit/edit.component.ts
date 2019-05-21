import { Component, OnInit, ViewEncapsulation,OnDestroy } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../+common/services/auth.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { environment } from '../../../../environments/environment';

import {
    FormGroup,
    FormControl
} from '@angular/forms';

declare var $: any;
declare var kendo: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'package-edit',
    templateUrl: './edit.html',
    styleUrls: ['./edit.scss']
})

export class EditComponent implements OnInit,OnDestroy {

    // 订阅对象集
    subscribes:Array<any>=[];

    // 数据双向绑定
    model = {
        basic:{
            id:null,
            name: null,
            contractType: null,
            minAmount: null,
            maxAmount: null,
            packageTag: [],
            description: null,
            packageId:null,
            priceSetName:null,
            packageType:null,
        }
    };

    // 控件数据绑定
    mdata = {
        packageTags:{
            data:[],
            init:()=>{
                this.mdata.packageTags.data = [
                    { text: '一般工商业用电', value: '1' },
                    { text: '大工业用电', value: '2' },
                    { text: '居民生活用电', value: '3' },
                    { text: '农业生产用电', value: '4' },
                    { text: '双边', value: '5' },
                    { text: '竞价', value: '6' },
                    { text: '绿色能源', value: '7' }, 
                ];
                /*this.sub3=this.authService.AuthGet(`${environment.sellerContractApi}api/Common/GetCities/1`).subscribe((res) => {
                    this.mdata.packageTags.data = res.json();
                });*/
            },
            change:(ele,v)=>{
                let tag = this.model.basic.packageTag;
                if(ele.target.checked){
                    tag.push(v);
                }else{
                    tag.splice(tag.indexOf(v),1);
                }
            },
            isChecked:(v)=>{
                if(this.model.basic.packageTag.length==0)return false;
                return this.model.basic.packageTag.indexOf(v)>-1;
            }
        },
        contractType: {
            data: [
                { text: '长协', value: 1 },
                { text: '竞价', value: 2 }
            ],
            change: () => {
                this.packages.init();
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
        packageTypes:[],
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
                contractType: this.model.basic.contractType,
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
                this.subscribes.push(this.authService.AuthPost(`${environment.sellerContractApi}api/Common/GetSubPackage`, req).subscribe((res) => {
                    the.data = res.json();
                }));
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
            this.packages.packageTypes=[];

            for (const extend of item.relatedMetas) {
                if (extend.metaType === 1) {
                    this.packageSettles.guarantees.disabled = false;
                    this.packageSettles.guarantees.type = extend.dataValueType;
                    this.packages.packageTypes.push(1);
                } else if (extend.metaType === 2) {
                    this.packageSettles.fixs.disabled = false;
                    this.packageSettles.fixs.type = extend.dataValueType;
                    this.packages.packageTypes.push(2);
                    if(extend.id.toUpperCase()==this.packageSettles.fixs.FixedProfitId){
                        this.packageSettles.fixs.isFixedProfit = true;
                    }
                } else if (extend.metaType === 4) {
                    this.packageSettles.rates.disabled = false;
                    this.packageSettles.rates.type = extend.dataValueType;
                    this.packages.packageTypes.push(3);
                } else if (extend.metaType === 5) {
                    this.packageSettles.rates.disabled = false;
                    this.packageSettles.rates.type = extend.dataValueType;
                    this.packages.packageTypes.push(3);
                } else if (extend.metaType === 6) {
                    this.packageExtends.maxQ.disabled = false;
                } else if (extend.metaType === 7) {
                    this.packageExtends.minQ.disabled = false;
                } else if (extend.metaType === 8) {
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
            the.packageTypes=[];
        },
        init:()=>{
            this.packages.clear();
            this.packageExtends.disabled();
            this.packageSettles.disabled();

            let contractType = this.model.basic.contractType;
            this.subscribes.push(this.authService.AuthGet(`${environment.sellerContractApi}api/Common/GetMetaPackage/${contractType}`).subscribe((res) => {
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
            }));
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
        hasEmpty:(item)=>{
            return item.min==null || item.max==null || item.price==null;
        },
        guarantees: {
            type:null,
            disabled: true,
            items: [{
                min:null,
                max:null,
                price:null
            }],
            add: () => {
                const the = this.packageSettles.guarantees;
                let last = the.items[the.items.length-1];
                if(this.packageSettles.hasEmpty(last)){
                    return;
                }
                the.items.push({
                    min: last.max,
                    max: null,
                    price: null
                });
            },
            remove: (index) => {
                let the = this.packageSettles.guarantees;
                the.items.splice(index, 1);
            }
        },
        fixs: {
            FixedProfitId:'61CEBC54-4EF8-49F3-9FA3-05F1E30A6748', // 固定收益ID
            isFixedProfit:false,
            type:null,
            disabled: true,
            items: [{
                min:null,
                max:null,
                price:null
            }],
            add: () => {
                const the = this.packageSettles.fixs;
                let last = the.items[the.items.length-1];
                if(this.packageSettles.hasEmpty(last)){
                    return;
                }
                the.items.push({
                    min: last.max,
                    max: null,
                    price: null
                });
            },
            remove: (index) => {
                let the = this.packageSettles.fixs;
                the.items.splice(index, 1);
            }
        },
        rates: {
            type:null,
            disabled: true,
            items: [{
                min:null,
                max:null,
                price:null
            }],
            add: () => {
                const the = this.packageSettles.rates;
                let last = the.items[the.items.length-1];
                if(this.packageSettles.hasEmpty(last)){
                    return;
                }
                the.items.push({
                    min: last.max,
                    max: null,
                    price: null
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
            const the = this.offsets;
            let last = the.items[the.items.length-1];
            
            the.items.push({
                min: last.max,
                max: null,
                price: null
            });
        },
        remove: (index) => {
            let the = this.offsets;
            the.items.splice(index, 1);
        },

    };

    // 套餐数据
    packageModel = {
        data: {
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
        request: () => {
            const the = this.packageModel.data;
            const item = this.packages.value;

            the.setId = item.id
            the.settleType = this.packageSettles.isPrice ? 1 : 2;
            the.metaValues = [];

            // 结算
            for (const meta of item.relatedMetas) {
                let data;
                let unit = the.settleType;
                const sets = [];
                if (meta.metaType === 1) {
                    data = this.packageSettles.guarantees;
                } else if (meta.metaType === 2) {
                    data = this.packageSettles.fixs;
                } else if (meta.metaType === 4 || meta.metaType === 5) {
                    data = this.packageSettles.rates;
                    unit = 4;
                } else {
                    continue;
                }
                for (const value of data.items) {
                    sets.push({
                        minValue: value.min,
                        maxValue: value.max,
                        dataValue: value.price
                    });
                }
                the.metaValues.push({
                    id: meta.id,
                    dataValueType: meta.dataValueType,
                    dataValueUnitType: unit, // 按价格:1 按价差: 2 按电量:3 按万分比:4
                    setData: sets
                });
            }

            // 扩展
            if (this.packageExtends.maxQ.value != null) {
                the.metaValues.push({
                    id: this.packageExtends.maxQ.id,  // 下限电量
                    dataValueType: 2,
                    dataValueUnitType: 3,
                    setData: [{
                        minValue: null,
                        maxValue: null,
                        dataValue: this.packageExtends.maxQ.value
                    }]
                });
            }
            if (this.packageExtends.minQ.value != null) {
                the.metaValues.push({
                    id: this.packageExtends.minQ.id,
                    dataValueType: 2,
                    dataValueUnitType: 1,
                    setData: [{
                        minValue: null,
                        maxValue: null,
                        dataValue: this.packageExtends.minQ.value // 上限收益
                    }]
                });
            }
            if (this.packageExtends.compQ.value != null) {    // 赔偿收益
                the.metaValues.push({
                    id: this.packageExtends.compQ.id,
                    dataValueType: 2,
                    dataValueUnitType: 1,
                    setData: [{
                        minValue: null,
                        maxValue: null,
                        dataValue: this.packageExtends.compQ.value
                    }]
                });
            }

            // 偏差电量担保
            if (this.offsets.currentWay !== '0') {
                const sets = [];
                for (const value of this.offsets.items) {
                    sets.push({
                        minValue: value.min,
                        maxValue: value.max,
                        dataValue: value.price
                    });
                }
                the.metaValues.push({
                    id: this.offsets.currentWay,
                    dataValueType: 3,
                    dataValueUnitType: this.offsets.types.fill ? 1 : 4, // 按价格:1 按价差: 2 按电量:3 按万分比:4
                    setData: sets
                });
                // 担保最大金额
                the.metaValues.push({
                    id: this.offsets.bao.id,
                    dataValueType: 1,
                    dataValueUnitType: 1, // 按价格:1 按价差: 2 按电量:3 按万分比:4
                    setData: [{
                        minValue: null,
                        maxValue: null,
                        dataValue: this.offsets.bao.value
                    }]
                });
            }


        }
    };

    constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute) { }

    // 提交
    submit(e) {
        e.preventDefault();

        const the = this;
        const contractType = the.model.basic.contractType;

        if (the.packages.value == null) {
            alert('请选择一个套餐');
            return;
        }

        // 基础信息
        let basic = the.model.basic;

        basic.priceSetName = the.packages.value.name;
        basic.packageType = the.packages.packageTypes.join(',');
        
        // 套餐请求
        the.packageModel.request();
        this.subscribes.push(the.authService.AuthPost(`${environment.sellerContractApi}api/Common/SubmitPackageData`, the.packageModel.data).subscribe((res) => {
            const packageId = res.json().Id;

            basic.packageId = packageId;

            // 请求参数
            const request = basic as any;

            request.packageTag = basic.packageTag.join(',');

            this.subscribes.push(the.authService.AuthPost(`${environment.sellerCRMApi}api/SellPackages`, request).subscribe((smsg) => {
                let msg = smsg.json();
                if(!msg.result){
                    alert(msg.msg);
                }
                else{
                    the.router.navigate(['/sale/packages']);
                }
            }));
        }));
    }

    ngOnInit() {
        this.mdata.packageTags.init();  

        let id = this.route.snapshot.params['id'];

        this.subscribes.push(this.authService.AuthGet(`${environment.sellerCRMApi}api/SellPackages/GetDetail/${id}`).subscribe(res =>{
            let result = res.json();
            this.model.basic = result;
            this.packages.packageTypes=result.packageType.split(',');

            this.packages.init();

            //套餐模块
            this.subscribes.push(this.authService.AuthGet(`${environment.sellerContractApi}api/Common/SubmitPackageData/${result.packageId}`).subscribe(pack =>{
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
                    else if(item.id.toUpperCase()==this.packageExtends.maxQ.id){
                        this.packageExtends.maxQ.checked=true;
                        this.packageExtends.maxQ.value = item.setDataValue[0].dataValue;
                    }
                    else if(item.id.toUpperCase()==this.packageExtends.minQ.id){
                        this.packageExtends.minQ.checked=true;
                        this.packageExtends.minQ.value = item.setDataValue[0].dataValue;
                    }
                    else if(item.id.toUpperCase()==this.packageExtends.compQ.id){
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
            }));
        }));
    }

    ngOnDestroy(): void {
        this.subscribes.forEach(item => {
            if(item!=null && item!=undefined) item.unsubscribe();
        });
    }
}
