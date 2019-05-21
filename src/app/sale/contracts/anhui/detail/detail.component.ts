import { Component, OnInit, ViewEncapsulation,OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../+common/services/auth.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import{ environment } from '../../../../../environments/environment';
declare var $: any;
declare var kendo: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'detail',
    templateUrl: './detail.html',
    styleUrls: ['./detail.css']
})
export class DetailComponent implements OnDestroy{
    sub1;sub2;

    model = {
        contractSubject: {},
        contracts: {
            validDate: "",
            beginDate: "",
            endDate: "",
            tradeCount: 0,
            plansCount: 0,
            planRate: "",
            tradeRate: "",
            planRatef: "",
            tradeRatef: ""
        },
        contractPlans: [], contractAttachments: []
    };

    //套餐数据
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

    currentUrl: string;

    historyUrl: string;

    uploadroot = environment.uploadRoot;

    public isLong:number;
    public isHaveCompensatePrice:boolean = false;
    public isHavecompensateAmount: boolean = false;

    constructor(private router: Router, private authService: AuthService, private http: Http, private route: ActivatedRoute) {
        
    }
    ngOnInit() {
        let __this = this;

        let id = __this.route.snapshot.params['id'];

        __this.currentUrl = __this.router.url;
        __this.historyUrl = `/sale/contracts/anhui/history/${id}`;

        //var id = 2;
        this.sub1=this.authService.AuthGet(`${environment.sellerContractApi}api/AHContract/GetContractDetail/` + id).subscribe( (res) =>{
            let result = res.json();
            this.model = result;
            this.isLong = result.contracts.contractType;
            this.isHaveCompensatePrice = result.contracts.compensatePrice!=null && result.contracts.compensatePrice !=0 ?true :false;
            this.isHavecompensateAmount = result.contracts.compensateAmount != null && result.contracts.compensateAmount != 0 ? true : false;

            let contractInfo = __this.model.contracts;
            __this.model.contracts.validDate = `${kendo.toString(new Date(contractInfo.beginDate), "yyyy.MM.dd")} - ${kendo.toString(new Date(contractInfo.endDate), "yyyy.MM.dd")}`;

            let PlanRatef = kendo.parseFloat(kendo.toString(contractInfo.tradeCount / contractInfo.plansCount * 100, "n"));
            let TradeRatef = kendo.parseFloat(kendo.toString((contractInfo.tradeCount - contractInfo.plansCount) / contractInfo.plansCount * 100, "n"));

            contractInfo.planRate = PlanRatef + "%";
            contractInfo.planRatef = (PlanRatef > 100 ? 100 : PlanRatef) + "%";

            if (contractInfo.tradeCount <= contractInfo.plansCount) {
                contractInfo.tradeRate = "0%";
                contractInfo.tradeRatef = "0%";
            }
            else {
                contractInfo.tradeRate = TradeRatef + "%";
                contractInfo.tradeRatef = (TradeRatef > 100 ? 100 : TradeRatef) + "%";
            }

            //套餐模块
            this.sub2=this.authService.AuthGet(`${environment.sellerContractApi}api/Common/SubmitPackageData/${result.contracts.packageId}`).subscribe((pack) =>{
                let mpack = pack.json();
                let pm = this.packageModel;
                //套餐选择
                pm.package.name = mpack.priceSet.name;

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
        });
        function setsizeFunction() {
            var $willBuy = $(".will-buy");
            var $bought = $(".bought");
            var $used = $(".used");
            var w = $willBuy.find(".echart span").width();
            $bought.find(".echart span").width($bought.find(".count").text() / $willBuy.find(".count").text() * w);
            $used.find(".echart span").width($used.find(".count").text() / $willBuy.find(".count").text() * w);
        }
        setsizeFunction();
    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
    }
}