import { Component, OnInit, ViewEncapsulation,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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
    selector: 'package-create',
    templateUrl: './create.html',
    styleUrls: ['./create.scss']
})

export class CreateComponent implements OnInit,OnDestroy {

    // 订阅对象集
    subscribes:Array<any>=[];

    // 数据双向绑定
    model = {
        basic:{
            name: null,
            contractType: 1,
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
                    { text: '一般工商业用电', value: 1 },
                    { text: '大工业用电', value: 2 },
                    { text: '居民生活用电', value: 3 },
                    { text: '农业生产用电', value: 4 },
                    { text: '双边', value: 5 },
                    { text: '竞价', value: 6 },
                    { text: '绿色能源', value: 7 }, 
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

    // 套餐选择
    packages = {
        data: [],
        types: [],
        guarantees: [],
        fixs: [],
        markets: [],
        bids: [],
        isMarket: true,
        value: null,
        packageTypes:[],
        doActive: (type) => {
            const the = this.packages;
            let types = [];

            if (type.metaType === 4 && !the.isMarket) {
                return false;
            } else if (type.metaType === 5 && the.isMarket) {
                return false;
            }

            if (type.metaType === 1) {
                types = the.guarantees;
            } else if (type.metaType === 2) {
                types = the.fixs;
            } else if (type.metaType === 4) {
                types = the.markets;
            } else if (type.metaType === 5) {
                types = the.bids;
            }

            for (const g of types) {
                if (g.id === type.id) {
                    if (g.isActive) {
                        g.isActive = false;
                    } else {
                        g.isActive = true;
                    }
                } else {
                    g.isActive = false;
                }
            }
            return true;
        },
        switchRate: (i) => {
            const the = this.packages;
            the.isMarket = (i === 1);

            if (the.isMarket) {
                for (const g of the.bids) {
                    g.isActive = false;
                }
            } else {
                for (const g of the.markets) {
                    g.isActive = false;
                }
            }

        },
        getRequest: () => {
            const the = this.packages;
            const ids = [];
            for (const item of the.guarantees) {
                if (item.isActive) {
                    ids.push(item.id);
                    break;
                }
            }
            for (const item of the.fixs) {
                if (item.isActive) {
                    ids.push(item.id);
                    break;
                }
            }
            if (the.isMarket) {
                for (const item of the.markets) {
                    if (item.isActive) {
                        ids.push(item.id);
                        break;
                    }
                }
            } else {
                for (const item of the.bids) {
                    if (item.isActive) {
                        ids.push(item.id);
                        break;
                    }
                }
            }

            if (ids.length !== 0) {

                const request = {
                    contractType: this.model.basic.contractType,
                    priceSetMetaOne: '',
                    priceSetMetaTwo: '',
                    priceSetMetaThree: ''
                };

                request.priceSetMetaOne = ids[0];

                if (ids.length === 2) {
                    request.priceSetMetaTwo = ids[1];
                } else if (ids.length === 3) {
                    request.priceSetMetaTwo = ids[1];
                    request.priceSetMetaThree = ids[2];
                }

                return request;
            }
        },
        selectType: (type) => {
            const the = this.packages;
            const flag = the.doActive(type);
            if (flag) {

                const req = the.getRequest();

                the.data = [];
                this.packageExtends.disabled();
                this.packageSettles.disabled();

                if (req != null) {
                    this.subscribes.push(this.authService.AuthPost(`${environment.sellerContractApi}api/Common/GetSubPackage`, req).subscribe((res) => {
                        the.data = res.json();
                    }));
                }
            }
        },
        select: (item) => {
            
            const the = this.packages;
            let isEmpty = false;

            the.value = item;

            for (const g of the.data) {
                if (g.id === item.id) {
                    if (g.isActive) {
                        g.isActive = false;
                        isEmpty = true;
                    } else {
                        g.isActive = true;
                    }
                } else {
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
            const the = this.packages;
            the.guarantees = [];
            the.fixs = [];
            the.markets = [];
            the.bids = [];
            the.data = [];
            the.packageTypes=[];
        },
        init: () => {
            this.packages.clear();
            this.packageExtends.disabled();
            this.packageSettles.disabled();

            const contractType = this.model.basic.contractType;
            this.subscribes.push(this.authService.AuthGet(`${environment.sellerContractApi}api/Common/GetMetaPackage/${contractType}`).subscribe((res) => {
                const types = res.json();

                this.packages.types = types;

                for (const t of types) {
                    if (t.metaType === 1) {
                        this.packages.guarantees.push(t);
                    } else if (t.metaType === 2) {
                        this.packages.fixs.push(t);
                    } else if (t.metaType === 4) {
                        this.packages.markets.push(t);
                    } else if (t.metaType === 5) {
                        this.packages.bids.push(t);
                    }
                }
            }));
        }
    };
    // 扩展选择
    packageExtends = {
        maxQ: {
            disabled: true,
            checked: false,
            value: null,
            change: () => {
                const the = this.packageExtends;
            }
        },
        minQ: {
            disabled: true,
            checked: false,
            value: null,
            change: () => {
                const the = this.packageExtends;
            }
        },
        compQ: {
            disabled: true,
            checked: false,
            value: null,
            change: () => {
                const the = this.packageExtends;
            }
        },
        disabled: () => {
            const the = this.packageExtends;
            the.maxQ.disabled = true;
            the.minQ.disabled = true;
            the.compQ.disabled = true;
        }
    };
    // 结算选择
    packageSettles = {
        isPrice: true,
        switch: (i) => {
            const the = this.packageSettles;
            the.isPrice = (i === 1);
        },
        hasEmpty:(item)=>{
            return item.min==null || item.max==null || item.price==null;
        },
        guarantees: {
            type:null,
            disabled: true,
            items: [{
                min: null,
                max: null,
                price: null
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
                const the = this.packageSettles.guarantees;
                the.items.splice(index, 1);
            }
        },
        fixs: {
            FixedProfitId:'61CEBC54-4EF8-49F3-9FA3-05F1E30A6748', // 固定收益ID
            isFixedProfit:false,
            type:null,
            disabled: true,
            items: [{
                min: null,
                max: null,
                price: null
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
                const the = this.packageSettles.fixs;
                the.items.splice(index, 1);
            }
        },
        rates: {
            type:null,
            disabled: true,
            items: [{
                min: null,
                max: null,
                price: null
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
                const the = this.packageSettles.rates;
                the.items.splice(index, 1);
            }
        },
        disabled: () => {
            const the = this.packageSettles;
            the.guarantees.disabled = true;
            the.fixs.disabled = true;
            the.rates.disabled = true;
        }
    };
    // 偏差担保
    offsets = {
        ways: [
            { text: '不承担偏差', value: '0' },
            { text: '百分比价差补偿', value: 'AF77DE64-1D95-4231-B303-31619D230DB4' },
            { text: '电量价差补偿', value: '3E19EDBC-EF2F-4345-99F6-AF7D2729A235' },
            { text: '百分惩罚分摊', value: '873D66ED-3123-43FA-BD96-4819D0097304' },
            { text: '电量惩罚分摊', value: '5B0CA548-C78F-409C-88B7-DC971E4CFF89' },
            // { text: "担保偏差电量", value: "5" }
        ],
        remark:null,
        currentWay: '0',
        bao: { id: '8B597FC3-E957-4A4C-BD2E-A11B3C4B2B59', value: null },
        items: [],
        types: {
            none: true,     // 不承担偏差
            offset: false,  // 是否偏差百分比true（考核电量false）
            fill: false,    // 是否补偿true（惩罚false）
            bao: false      // 担保偏差电量
        },
        swidth: () => {
            const the = this.offsets;

            the.items = [];

            if (the.currentWay === '0') {
                the.types.none = true;
                the.remark = null;
            } else {
                the.types.none = false;
                the.items.push({
                    min: null,
                    max: null,
                    price: null
                });
            }
            if (the.currentWay === 'AF77DE64-1D95-4231-B303-31619D230DB4') {
                the.types.offset = true;
                the.types.fill = true;
                the.remark = '用户补偿售电公司的偏差惩罚金额';
            } else if (the.currentWay === '3E19EDBC-EF2F-4345-99F6-AF7D2729A235') {
                the.types.offset = false;
                the.types.fill = true;
                the.remark = '依照考核电量用户支付赔偿金给售电公司';
            } else if (the.currentWay === '873D66ED-3123-43FA-BD96-4819D0097304') {
                the.types.offset = true;
                the.types.fill = false;
                the.remark = '售电公司按照约定的偏差比例帮用户承担偏差惩罚';
            } else if (the.currentWay === '5B0CA548-C78F-409C-88B7-DC971E4CFF89') {
                the.types.offset = false;
                the.types.fill = false;
                the.remark = '售电公司按照约定的考核电量帮用户承担偏差惩罚';
            }
            if (the.currentWay === '5') {
                the.types.offset = false;
                the.types.bao = true;
                the.remark = '售电公司按照约定的考核电量帮用户承担偏差惩罚';
            } else {
                the.types.bao = false;
            }
        },
        add: () => {
            const the = this.offsets;
            const last = the.items[the.items.length-1];
            
            the.items.push({
                min: last.max,
                max: null,
                price: null
            });
        },
        remove: (index) => {
            const the = this.offsets;
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
                    id: '08A0F6BD-1978-4F38-A44B-EFC3C5D790B1',  // 下限电量
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
                    id: '5AEEC840-56F2-4FEE-A930-0B0BA55B847C',
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
                    id: 'C83C44A6-CA2A-4F74-926D-07E950F9593E',
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

    constructor(private router: Router, private authService: AuthService, private http: Http) { }

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
        this.packages.init();
    }
    ngOnDestroy(): void {
        this.subscribes.forEach(item => {
            if(item!=null && item!=undefined) item.unsubscribe();
        });
    }
}
