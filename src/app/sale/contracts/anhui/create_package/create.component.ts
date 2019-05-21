import { Component, OnInit, ViewEncapsulation,OnDestroy } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../+common/services/auth.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { environment } from '../../../../../environments/environment';
import { Location } from '@angular/common';

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
        },
        pid:null
    };

    // 控件数据绑定
    mdata = {
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
                    if(city!=undefined && city!=null) this.model.customer.City=city;
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
                    if(firId!=undefined && firId!=null) this.model.customer.IndustryCategorySecondId=firId;
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
    
    // 套餐数据
    packageModel = {
        package: {
            id: 1,
            name: "保底和固定",
        },
        settles:{
            isPrice:false,
            guarantees:[],
            fixs:[],
            rates:[]
        },
        extends: {
            data:[],
            maxQ:{
                id:"08A0F6BD-1978-4F38-A44B-EFC3C5D790B1",
                name:"下限电量",
                value:null,
                unit:"万千瓦时"
            },
            minQ:{
                id:"5AEEC840-56F2-4FEE-A930-0B0BA55B847C",
                name:"上限收益",
                value:null,
                unit:"万元"
            },
            compQ:{
                id:"C83C44A6-CA2A-4F74-926D-07E950F9593E",
                name:"赔偿收益",
                value:null,
                unit:"万元"
            }
        },
        offsets:{
            ways: [
                { text: "不承担偏差", value: "0",offset:null,fill:null },
                { text: "百分比价差补偿", value: "AF77DE64-1D95-4231-B303-31619D230DB4",offset:true,fill:true },
                { text: "电量价差补偿", value: "3E19EDBC-EF2F-4345-99F6-AF7D2729A235",offset:false,fill:true },
                { text: "百分惩罚分摊", value: "873D66ED-3123-43FA-BD96-4819D0097304",offset:true,fill:false },
                { text: "电量惩罚分摊", value: "5B0CA548-C78F-409C-88B7-DC971E4CFF89",offset:false,fill:false },
                //{ text: "担保偏差电量", value: "5" }
            ],
            currentWay: {id:"0",name:"",offset:null,fill:null},
            bao:{id:"8B597FC3-E957-4A4C-BD2E-A11B3C4B2B59",value:null},
            items:[]
        }
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

    constructor(private router: Router, private authService: AuthService,private route: ActivatedRoute,private location:Location) { }

    // 提交
    submit(e) {
        e.preventDefault();

        const the = this;
        const contractType = the.model.contract.ContractType;

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
        };

        // 附件
        const $imgs = $('#products .product>img');
        const attachs = [];
        $imgs.each(function () {
            attachs.push({ fileDataId: this.id });
        });

        // 请求参数
        const request = {
            contract: contract,
            contractPlans: the.plans.data,
            contractSubject: subject,
            contractAttachments: attachs,
            customerSalePackagesId: the.packageModel.package.id
        };
        this.sub11=the.authService.AuthPost(`${environment.sellerContractApi}api/AHContract/AddOrUpdateContract`, request).subscribe(smsg => {
            let msg = smsg.json();
            if(!msg.result){
                alert(msg.msg);
            }
            else{
                this.back();
            }
        });
    }

    back(){
        this.location.back();
    }

    ngOnInit() {
        this.mdata.area.init();
        this.mdata.industry.init();
        this.mdata.voltage.init();

        // 绑定已选择好的购电套餐
        let pid = this.route.snapshot.params['pid'];
        this.model.pid=pid;
        if(pid!=null && pid!=undefined){
            //套餐模块
            this.sub12=this.authService.AuthGet(`${environment.sellerContractApi}api/AHContract/GetClientAndPackageInfo/${pid}`).subscribe(pack =>{
                let mcpack = pack.json();
                let subject = mcpack.subjectInfo;

                for(let key in subject){
                    let k = key.substr(0,1).toUpperCase()+key.substr(1);
                    this.model.customer[k] = subject[key];
                }

                this.mdata.industry.change(subject.industryCategorySecondId);
                this.mdata.area.change(subject.city);

                let pm = this.packageModel;
                let mpack = mcpack.packageDetail;
                //套餐选择
                pm.package.name = mpack.priceSet.name;
                pm.package.id = pid;

                pm.settles.isPrice=(mpack.settleType==1);

                for(let item of mpack.priceSetMetaDetail){
                    //结算方式
                    if(item.metaType==1){
                        for(let value of item.setDataValue){
                            pm.settles.guarantees.push({
                                min:value.lowerBound,
                                max:value.upperBound,
                                price:value.dataValue
                            });
                        }
                    }
                    else if(item.metaType==2){
                        for(let value of item.setDataValue){
                            pm.settles.fixs.push({
                                min:value.lowerBound,
                                max:value.upperBound,
                                price:value.dataValue
                            });
                        }
                    }
                    else if(item.metaType==4 || item.metaType==5){
                        for(let value of item.setDataValue){
                            pm.settles.rates.push({
                                min:value.lowerBound,
                                max:value.upperBound,
                                price:value.dataValue
                            });
                        }
                    }
                    //扩展选择
                    else if(item.id.toUpperCase()==pm.extends.maxQ.id){
                        pm.extends.maxQ.value = item.setDataValue[0].dataValue;
                        pm.extends.data.push(pm.extends.maxQ);
                    }
                    else if(item.id.toUpperCase()==pm.extends.minQ.id){
                        pm.extends.minQ.value = item.setDataValue[0].dataValue;
                        pm.extends.data.push(pm.extends.minQ);
                    }
                    else if(item.id.toUpperCase()==pm.extends.compQ.id){
                        pm.extends.compQ.value = item.setDataValue[0].dataValue;
                        pm.extends.data.push(pm.extends.compQ);
                    }

                    //偏差电量担保
                    for(let offset of pm.offsets.ways){
                        if(offset.value==item.id.toUpperCase()){
                            pm.offsets.currentWay.id = item.id.toUpperCase();
                            pm.offsets.currentWay.name = item.name;
                            pm.offsets.currentWay.offset = offset.offset?"偏差百分比":"考核电量";
                            pm.offsets.currentWay.fill = offset.fill?"补偿单价":"电网惩罚金额的百分比";
                            
                            for(let value of item.setDataValue){
                                pm.offsets.items.push({
                                    min:value.lowerBound,
                                    max:value.upperBound,
                                    price:value.dataValue
                                });
                            }
                            break;
                        }
                    }

                    //担保最大金额
                    if(pm.offsets.bao.id==item.id.toUpperCase()){
                        pm.offsets.bao.value = item.setDataValue[0].dataValue;
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
