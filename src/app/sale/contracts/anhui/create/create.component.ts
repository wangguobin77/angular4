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
    selector: 'create',
    templateUrl: './create.html',
    styleUrls: ['./create.css']
})

export class CreateComponent implements OnInit,OnDestroy {
sub1;sub2;sub3;sub4;sub5;sub6;sub7;sub8;sub9;sub10;sub11;sub12;
    // 数据双向绑定
    model = {
        customer: {
            Id: 0,
            SellerId: null,
            UserSubjectId: null,
            SaleUserId: null,
            CreateDate: null,
            SubjectName: null,
            CustomerNum: null,
            TradingCenterId: 0,
            IndustryCategoryFirstId: null,
            IndustryCategorySecondId: null,
            LegalPerson: null,
            UsedPowerType: null,
            Province: null,
            City: null,
            Address: null,
            Operator: null,
            PhoneNumber: null,
            RegisterManagePlace: null,
            TaxNumber: null,
            VoltageLevel: null,
            Capacitance: null,
            TransformerCapability: null,
            SecretKey: null,
            ElectricityAmount: null,
            AptitudeCode: null,
            Source: 0,
            TransferSaleId: null,
            CustomerLevel: null
        },
        contract: {
            ContractName: null,
            ContractNumber: null,
            StartDate: null,
            EndDate: null,
            ContractType: 1,
        },
        plan: {
            PlansCount: null
        }
    };

    // 控件数据绑定
    mdata = {
        customer: {
            data: [],
            filter: (name) => {
                let the = this.mdata.customer;
                this.sub1=this.authService.AuthGet(`${environment.sellerContractApi}api/AHContract/GetSubjectList/${name}`).subscribe((res) => {
                    the.data = res.json();
                });
            },
            change: () => {
                let id = this.model.customer.Id;
                if (id !== 0) {
                    this.sub2=this.authService.AuthGet(`${environment.sellerContractApi}api/AHContract/${id}`).subscribe((res) => {
                        let data = res.json();

                        if (data != null) {
                            this.model.customer = data;
                            this.model.customer.VoltageLevel = data.VoltageLevel.toString();
                            this.mdata.area.change(data.City);
                            this.mdata.industry.change(data.IndustryCategorySecondId);
                        }
                    });
                }
            }
        },
        UsedPowerTypes: [
            { text: '一般工商业用电', value: 2 },
            { text: '大工业用电', value: 1 },
            { text: '居民生活用电', value: 3 },
            { text: '农业生产用电', value: 4 }
        ],
        area: {
            provinces: [],
            cities: [],
            init: () => {
                let the = this.mdata.area;
                this.sub3=this.authService.AuthGet(`${environment.sellerContractApi}api/Common/GetCities/1`).subscribe((res) => {
                    the.provinces = res.json();
                });
            },
            change: (city:undefined) => {
                let the = this.mdata.area;
                let pcode = this.model.customer.Province;

                this.model.customer.City = null;
                the.cities = [];

                if (pcode == null) {
                    return;
                }
                this.sub4=this.authService.AuthGet(`${environment.sellerContractApi}api/Common/GetCities/${pcode}`).subscribe((res) => {
                    the.cities = res.json();
                    if(city!=undefined) this.model.customer.City=city;
                });
            }
        },
        industry: {
            firs: [],
            secs: [],
            init: () => {
                let the = this.mdata.industry;
                this.sub5=this.authService.AuthGet(`${environment.sellerContractApi}api/Common/GetIndustryCategory/0`).subscribe((res) => {
                    the.firs = res.json();
                });
            },
            change: (firId:undefined) => {
                let the = this.mdata.industry;
                let id = this.model.customer.IndustryCategoryFirstId;

                this.model.customer.IndustryCategorySecondId = null;
                the.secs = [];

                if (id == null) {
                    return;
                }
                this.sub6=this.authService.AuthGet(`${environment.sellerContractApi}api/Common/GetIndustryCategory/${id}`).subscribe((res) => {
                    the.secs = res.json();
                    if(firId!=undefined) this.model.customer.IndustryCategorySecondId=firId;
                });
            }
        },
        voltage: {
            data: [],
            init: () => {
                let the = this.mdata.voltage;
                this.sub7=this.authService.AuthGet(`${environment.sellerContractApi}api/Common/GetDics/VoltageLevel`).subscribe(function (res) {
                    the.data = res.json();
                });
            }
        },
        contractType: {
            data: [
                { text: '长协', value: 1 },
                { text: '竞价', value: 2 }
            ],
            change: () => {
                this.plans.init();
                this.packages.init();
            }
        }
    };

    // 合约分解
    plans = {
        valid: {
            pass: false,
            msg: '',
            check: () => {
                let the = this.plans;
                if (this.model.contract.ContractType === 2) {
                    the.valid.pass = true;
                    return true;
                }
                if (this.model.plan.PlansCount == null) {
                    the.valid.msg = '下面表格长协电量必填，竞价电量选填';
                    the.valid.pass = false;
                    return false;
                }
                let sum = 0;
                for (let item of the.data) {
                    sum += (item.longAmount == null ? 0 : item.longAmount);
                }
                if (sum !== this.model.plan.PlansCount) {
                    the.valid.msg = '下面表格长协电量输入的总和必须等于总预购电量';
                    the.valid.pass = false;
                    return false;
                }
                the.valid.pass = true;
                return true;
            }
        },
        data: [],
        getMonthNumber: (date1, date2) => {
            date1 = date1.replace(/\//g, '');
            date2 = date2.replace(/\//g, '');
            // 默认格式为"20030303"
            const year1 = date1.substr(0, 4);
            const year2 = date2.substr(0, 4);
            const month1 = date1.substr(4, 2);
            const month2 = date2.substr(4, 2);
            const len = (year2 - year1) * 12 + (month2 - month1);
            return len;
        },
        init: () => {
            const the = this.plans;
            let contract = this.model.contract;
            the.data = [];

            if (contract.StartDate != null && contract.EndDate != null) {
                const start = kendo.toString(contract.StartDate, 'yyyy/MM/01');
                const end = kendo.toString(contract.EndDate, 'yyyy/MM/01');
                const months = the.getMonthNumber(start, end); // 相差月份
                const startDate = kendo.parseDate(start);
                for (let i = 0; i <= months; i++) {
                    const startStr = kendo.toString(startDate, 'yyyy/MM');

                    the.data.push({
                        planYear: startDate.getFullYear(),
                        planMonth: startDate.getMonth() + 1,
                        date: startStr,
                        bidAmount: null,
                        longAmount: null
                    });

                    startDate.setMonth(startDate.getMonth() + 1);
                }
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
                    contractType: this.model.contract.ContractType,
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
                    this.sub8=this.authService.AuthPost(`${environment.sellerContractApi}api/Common/GetSubPackage`, req).subscribe((res) => {
                        the.data = res.json();
                    });
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

            for (const extend of item.relatedMetas) {
                if (extend.metaType === 1) {
                    this.packageSettles.guarantees.disabled = false;
                    this.packageSettles.guarantees.type = extend.dataValueType;
                } else if (extend.metaType === 2) {
                    this.packageSettles.fixs.disabled = false;
                    this.packageSettles.fixs.type = extend.dataValueType;
                    if(extend.id.toUpperCase()==this.packageSettles.fixs.FixedProfitId){
                        this.packageSettles.fixs.isFixedProfit = true;
                    }
                } else if (extend.metaType === 4) {
                    this.packageSettles.rates.disabled = false;
                    this.packageSettles.rates.type = extend.dataValueType;
                } else if (extend.metaType === 5) {
                    this.packageSettles.rates.disabled = false;
                    this.packageSettles.rates.type = extend.dataValueType;
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
        },
        init: () => {
            this.packages.clear();
            this.packageExtends.disabled();
            this.packageSettles.disabled();

            const contractType = this.model.contract.ContractType;
            this.sub9=this.authService.AuthGet(`${environment.sellerContractApi}api/Common/GetMetaPackage/${contractType}`).subscribe((res) => {
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
            });
        }
    };
    // 扩展选择
    packageExtends = {
        maxQ: {
            id:"08A0F6BD-1978-4F38-A44B-EFC3C5D790B1",
            disabled: true,
            checked: false,
            value: null,
            change: () => {
                const the = this.packageExtends;
            }
        },
        minQ: {
            id:"5AEEC840-56F2-4FEE-A930-0B0BA55B847C",
            disabled: true,
            checked: false,
            value: null,
            change: () => {
                const the = this.packageExtends;
            }
        },
        compQ: {
            id:"C83C44A6-CA2A-4F74-926D-07E950F9593E",
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
    // 单方协议
    agreements = {
        amount: null,
        price: null,
        isFixed: true,
        switch: (i) => {
            const the = this.agreements;
            the.isFixed = (i === 1);
        }
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

    constructor(private router: Router, private authService: AuthService,private route: ActivatedRoute) { }

    // 提交
    submit(e) {
        e.preventDefault();

        const the = this;
        const contractType = the.model.contract.ContractType;

        if (the.packages.value == null) {
            alert('请选择一个套餐');
            return;
        }

        // 用电主体
        const customer = the.model.customer;
        let industryCategoryName = '';
        for (const item of the.mdata.industry.firs) {
            if (customer.IndustryCategoryFirstId === item.id) {
                industryCategoryName = item.categoryName;
                break;
            }
        }
        for (const item of the.mdata.industry.secs) {
            if (customer.IndustryCategorySecondId === item.id) {
                industryCategoryName = `${industryCategoryName}/${item.categoryName}`;
                break;
            }
        }
        let cityName = '';
        for (const item of the.mdata.area.provinces) {
            if (customer.Province === item.code) {
                cityName = item.name;
                break;
            }
        }
        for (const item of the.mdata.area.cities) {
            if (customer.City === item.code) {
                cityName = `${cityName},${item.name}`;
                break;
            }
        }
        const subject = {
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

        // 合约信息
        const theContract = the.model.contract;
        const contract = {
            sellerSubjectId: customer.Id,
            contractNo: theContract.ContractNumber,
            name: theContract.ContractName,
            beginDate: theContract.StartDate,
            endDate: theContract.EndDate,
            contractType: contractType,
            plansCount: the.model.plan.PlansCount,
            compensateAmount: the.agreements.isFixed ? 0 : the.agreements.amount,
            compensatePrice: the.agreements.isFixed ? the.agreements.price : 0,
            packageId: 0
        };

        // 附件
        const $imgs = $('#products .product>img');
        const attachs = [];
        $imgs.each(function () {
            attachs.push({ fileDataId: this.id });
        });

        // 套餐请求
        the.packageModel.request();
        this.sub10=the.authService.AuthPost(`${environment.sellerContractApi}api/Common/SubmitPackageData`, the.packageModel.data).subscribe((res) => {
            const packageId = res.json().Id;

            contract.packageId = packageId;

            // 请求参数
            const request = {
                contract: contract,
                contractPlans: the.plans.data,
                contractSubject: subject,
                contractAttachments: attachs
            };

            this.sub11=the.authService.AuthPost(`${environment.sellerContractApi}api/AHContract/AddOrUpdateContract`, request).subscribe((smsg) => {
                let msg = smsg.json();
                if(!msg.result){
                    alert(msg.msg);
                }
                else{
                    the.router.navigate(['/sale/contracts/anhui/list']);
                }
            });
        });
    }


    ngOnInit() {
        this.mdata.area.init();
        this.mdata.industry.init();
        this.mdata.voltage.init();
        this.packages.init();

        // 绑定已选择好的购电套餐
        const pid = this.route.snapshot.params['pid'];
        if(pid!=null && pid!=undefined){
            this.sub12=this.authService.AuthGet(`${environment.sellerContractApi}api/Common/SubmitPackageData/${pid}`).subscribe((pack) =>{
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
        }
        

        // 上传合约附件
        $('#files').kendoUpload({
            async: {
                saveUrl: `${environment.sellerContractApi}/api/Upload/Kendo_Image_Upload`,
                autoUpload: true
            },
            validation: {
                allowedExtensions: ['.jpg', '.jpeg', '.png', '.bmp', '.gif']
            },
            success: onSuccess,
            showFileList: false,
            dropZone: '.dropZoneElement'
        });

        function onSuccess(e) {
            if (e.operation === 'upload') {
                for (let i = 0; i < e.files.length; i++) {
                    const file = e.files[i].rawFile;
                    if (file) {
                        const reader = new FileReader();
                        const fileId = e.response[i];
                        reader.onloadend = function () {
                            $('<div class=\'product\'><img src=' + this.result +
                                ' id=' + fileId +
                                ' /><i class=\'iconfont icon-guanbipsd\'></i></div>').appendTo($('#products'));
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
        }
        $(document).off('click', '.product i').on('click', '.product i', function () {
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
    }
}
