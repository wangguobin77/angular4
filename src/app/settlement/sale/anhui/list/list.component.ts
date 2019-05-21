import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
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
export class ListComponent implements OnDestroy {
    sub1;sub2;sub3;
    constructor(private router: Router, private authService: AuthService) { }

    ngOnInit() {      
        let the = this;

        let win:any={};
        let api=environment.sellerSettlementApi+"api/";
        let contractApi=environment.sellerContractApi+"api/";

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
                the.sub2=the.authService.AuthGet(`${api}AHMarketSettlement/GetSettlementYear`).subscribe(function (res) {
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
function resizeFunction(TotalPreAmount, TotalBuyAmount, TotalUseAmount) {
    var $list = $(".chart-box-r");
    $list.each(function () {
        var arr = new Array();
        arr.push(TotalPreAmount);
        arr.push(TotalBuyAmount);
        arr.push(TotalUseAmount);
        var arrMax = Math.max.apply(null, arr);

        let $willBuy = $(this).find(".will-buy");
        let $bought = $(this).find(".bought");
        let $used = $(this).find(".used");
        if (arrMax != 0) {
            $willBuy.find(".echart-box span").width((TotalPreAmount / arrMax * 100) + "%");
            $bought.find(".echart-box span").width((TotalBuyAmount / arrMax * 100) + "%");
            $used.find(".echart-box span").width((TotalUseAmount / arrMax * 100) + "%");
        } else {
            $willBuy.find(".echart-box span").width(0);
            $bought.find(".echart-box span").width(0);
            $used.find(".echart-box span").width(0);
        }
    })
}
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
    creatLeftChart: function (TotalCustomerAmount, TotalCompanyAmount) {
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
                    value: TotalCustomerAmount,
                    color: "#65b2fb"
                }, {
                    category: "客户承担总额",
                    value: TotalCompanyAmount,
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

function getGrid(SubjectName, UsedPowerType, Year, Month) {
    let request:any={};
    request.SubjectName = SubjectName;
    request.UsedPowerType = UsedPowerType==''?0:UsedPowerType;
    request.Year = (Year==''||Year==null)?0:Year;
    request.Month = Month==''?0:Month;

    the.sub3=the.authService.AuthPost(`${api}AHMarketSettlement/GetCustomerSettlement`,request).subscribe(res=>{
        let respdata = res.json();
        if (respdata == null) {
            return false;
        }
        //right bar
        $(".TotalPreAmount").text(respdata.TotalPreAmount);
        $(".TotalBuyAmount").text(respdata.TotalBuyAmount);
        $(".TotalUseAmount").text(respdata.TotalUseAmount);
        resizeFunction(respdata.TotalPreAmount, respdata.TotalBuyAmount, respdata.TotalUseAmount);
        //left pie
        $(".TotalDeviationAmount").html(respdata.TotalDeviationAmount + '<span class="size-14">元</span>');
        $(".TotalCompanyAmount").html(respdata.TotalCompanyAmount + '<span class="size-14">元</span>');
        $(".TotalCustomerAmount").html(respdata.TotalCustomerAmount + '<span class="size-14">元</span>');
        if (respdata.TotalCompanyAmount == 0 && respdata.TotalCustomerAmount == 0) {
            chart.creatLeftChart(0, 0);
        } else {
            var TotalCompanyAmount = (respdata.TotalCompanyAmount / (respdata.TotalCompanyAmount + respdata.TotalCustomerAmount) * 100).toFixed(2);
            var TotalCustomerAmount = (respdata.TotalCustomerAmount / (respdata.TotalCompanyAmount + respdata.TotalCustomerAmount) * 100).toFixed(2);
            chart.creatLeftChart(TotalCompanyAmount, TotalCustomerAmount);
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
                { field: "PlansCount", title: "计划购电量<p>(万千瓦时)</p>" },
                { field: "ActualPurchaseAmount", title: "交易电量<p>(万千瓦时)</p>" },
                { field: "ActualUsedAmount", title: "实际用电量<p>(万千瓦时)</p>" },
                { field: "DeviationAmount", title: "偏差惩罚总额<p>(元)</p>" },
                { field: "CompanyAmount", title: "公司承担金额<p>(元)</p>" },
                { field: "CustomerAmount", title: "客户承担金额<p>(元)</p>" },
                { field: "CustomerIncome", title: "客户收益<p>(元)</p>" }
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