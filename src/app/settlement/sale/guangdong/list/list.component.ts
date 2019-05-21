import { Component, OnInit, ViewEncapsulation,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../+common/services/auth.service';
import{ environment } from '../../../../../environments/environment';

declare var $: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'list',
    templateUrl: './list.html',
    styleUrls: ['./list.css']
})
export class ListComponent implements OnDestroy{
    sub1;sub2;sub3;
    constructor(private router: Router, private authService: AuthService) { }

    ngOnInit() {      
        let the = this;

        let win:any={};
        let api= environment.sellerSettlementApi+"api/";
        let contractApi=environment.sellerContractApi+"api/";

// 查询
$("#eletype").kendoDropDownList({
    dataTextField: "categoryValue",
    dataValueField: "categoryKey",
    dataSource: {
        transport: {
            read: function(f) {
                the.sub1=the.authService.AuthGet(`${contractApi}Common/GetDics/UsedPowerType`).subscribe(function (res) {
                    f.success(res.json());
                });
            }
        }
    },
    index: 0,
    optionLabel: "--选择用电类型--"
});
$("#dateyear").kendoDropDownList({
    dataSource: {
        transport: {
            read: function(f) {
                //f.success([2017,2027]);
                the.sub2=the.authService.AuthGet(`${api}GDPurchaseSettlement/GetSettlementYear`).subscribe(function (res) {
                    f.success(res.json());
                });
            },
        }
    },
    index: 0
});

$("#datemonth").kendoDropDownList({
    dataTextField: "text",
    dataValueField: "value",
    dataSource: [
        { text: "1月", value: "1" },
        { text: "2月", value: "2" },
        { text: "3月", value: "3" },
        { text: "4月", value: "4" },
        { text: "5月", value: "5" },
        { text: "6月", value: "6" },
        { text: "7月", value: "7" },
        { text: "8月", value: "8" },
        { text: "9月", value: "9" },
        { text: "10月", value: "10" },
        { text: "11月", value: "11" },
        { text: "12月", value: "12" }
    ],
    index: 0,
    optionLabel: "全部"
});
$(document).off("click", "#selectCondition").on("click", "#selectCondition", function () {
    $("#filtrateBox").slideToggle(100);
});
$("#btnSearch").off("click").on("click", function () {
    var subjectName = $("#SearchVal").val().trim()
    var UsedPowerType = $("#eletype").data("kendoDropDownList").value();
    var Year = $("#dateyear").data("kendoDropDownList").value();
    var Month = $("#datemonth").data("kendoDropDownList").value();
    getGrid(subjectName, UsedPowerType, Year, Month)
});
$("#iSearch").off("click").on("click", function () {
    $("#btnSearch").click();
});

var chart = {
    init: function () {
        this.resize();
        setTimeout(function() {
            $("#btnSearch").click();
        }, 200);
    },
    creatLeftChart: function (CustomerPunishAmountSum, CompanyPunishAmountSum) {
        $("#chart").kendoChart({
            title: {
                visible: false
            },
            legend: {
                visible: true,
                position: "top"
            },
            chartArea: {
                background: ""
            },
            seriesDefaults: {
                visible: true
            },
            series: [{
                type: "pie",
                startAngle: 150,
                data: [{
                    category: "公司承担总额",
                    value: CustomerPunishAmountSum,
                    color: "#65b2fb"
                }, {
                    category: "客户承担总额",
                    value: CompanyPunishAmountSum,
                    color: "#ff5015"
                }]
            }],
            tooltip: {
                visible: true,
                format: "{0}%"
            }
        });
    },
    refresh: function () {
        $("#chart").data("kendoChart").setOptions();
        //chartT.setOptions();
    },
    resize: function () {
        //$(window).resize(function () {
            //chart.refresh();
        //});
    }
}
chart.init();

function resizeFunction(CustomerProfitsSum, PunishSum, CustomerBenefitsSum) {
    var $list = $(".chart-box-r");
    $list.each(function () {
        var arr = new Array();
        arr.push(CustomerProfitsSum);
        arr.push(PunishSum);
        arr.push(CustomerBenefitsSum);
        var arrMax = Math.max.apply(null, arr);

        let $willBuy = $(this).find(".will-buy");
        let $bought = $(this).find(".bought");
        let $used = $(this).find(".used");
        if (arrMax != 0) {
            $willBuy.find(".echart-box span").width((CustomerProfitsSum / arrMax * 100) + "%");
            $bought.find(".echart-box span").width((PunishSum / arrMax * 100) + "%");
            $used.find(".echart-box span").width((CustomerBenefitsSum / arrMax * 100) + "%");
        } else {
            $willBuy.find(".echart-box span").width(0);
            $bought.find(".echart-box span").width(0);
            $used.find(".echart-box span").width(0);
        }
    })
}

function getGrid(SubjectName, UsedPowerType, Year, Month) {
    let request:any={};
    request.SubjectName = SubjectName;
    request.UsedPowerType = UsedPowerType==''?0:UsedPowerType;
    request.Year = (Year==''||Year==null)?0:Year;
    request.Month = Month==''?0:Month;

    the.sub3=the.authService.AuthPost(`${api}GDPurchaseSettlement/GetCustomerSettlement`,request).subscribe(res=>{
        let respdata = res.json();
        if (respdata == null) {
            return false;
        }
        //right bar
        $(".CustomerProfitsSum").text(respdata.CustomerProfitsSum);
        $(".PunishSum").text(respdata.PunishSum);
        $(".CustomerBenefitsSum").text(respdata.CustomerBenefitsSum);
        resizeFunction(respdata.CustomerProfitsSum, respdata.PunishSum, respdata.CustomerBenefitsSum);
        //left pie
        $(".TotalDeviationAmount").html(respdata.DeviationAmountSum + '<span class="size-14">元</span>');
        $(".CompanyPunishAmountSum").html(respdata.CompanyPunishAmountSum + '<span class="size-14">元</span>');
        $(".CustomerPunishAmountSum").html(respdata.CustomerPunishAmountSum + '<span class="size-14">元</span>');
        if (respdata.CompanyPunishAmountSum == 0 && respdata.CustomerPunishAmountSum == 0) {
            chart.creatLeftChart(0, 0);
        } else {
            var CompanyPunishAmountSum = (respdata.CompanyPunishAmountSum / (respdata.CompanyPunishAmountSum + respdata.CustomerPunishAmountSum) * 100).toFixed(2);
            var CustomerPunishAmountSum = (respdata.CustomerPunishAmountSum / (respdata.CompanyPunishAmountSum + respdata.CustomerPunishAmountSum) * 100).toFixed(2);
            chart.creatLeftChart(CompanyPunishAmountSum, CustomerPunishAmountSum);
        }

        //初始化列表
        $("#grid").kendoGrid({
            dataSource: {
                data: respdata.SettlementItemList==null?[]:respdata.SettlementItemList,
                pageSize: 10
            },
            pageable: {
                pageSizes: true,
                buttonCount: 5
            },
            noRecords: true,
            messages: {
                noRecords: "没有客户结算数据"
            },
            columns: [
                { field: "SubjectName", title: "客户名称", width: "270px" },
                { field: "ShenbaoAmount", title: "申报电量<p>(万千瓦时)</p>" },
                { field: "TradeAmount", title: "交易电量<p>(万千瓦时)</p>" },
                { field: "ActualUsedAmount", title: "实际用电量<p>(万千瓦时)</p>" },
                { field: "Percentage", title: "偏差率<p>(%)</p>" },
                { field: "CustomerProfits", title: "客户收益<p>(元)</p>" },
                { field: "DeviationAmount", title: "偏差考核金额<p>(元)</p>" },
                { field: "CompanyPunishAmount", title: "公司承担金额<p>(元)</p>" },
                { field: "CustomerPunishAmount", title: "客户承担金额<p>(元)</p>" },
                { field: "CustomerBenefits", title: "净收益<p>(元)</p>" },               
            ]
        });
    });
}

}
ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
		if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe();}
    }
}