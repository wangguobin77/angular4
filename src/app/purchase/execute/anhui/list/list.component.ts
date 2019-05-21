import { Component, OnInit, ViewEncapsulation,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../+common/services/auth.service';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';

import { Observable } from 'rxjs/Rx';
import { environment } from '../../../../../environments/environment';

declare var $: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'list',
    templateUrl: './list.html',
    styleUrls: ['./list.css']
})
export class ListComponent implements OnDestroy {
    sub1;
        constructor(private router: Router, private auth:AuthHttpService, private http: Http)
        {

        }
    ngOnInit() {

        var _this = this;

        $(document).off("click","#selectCondition").on("click", "#selectCondition", function () {
            $("#filtrateBox").slideToggle(100);
        })

        function GetPurchaseList(statusVal,purchasePlanType)
        {
            $("#grid").kendoGrid({
                    dataSource: {
                    transport: {
                        read: function(f) {
                            f.data = { Status: statusVal, PurchasePlanType: purchasePlanType }

                        var paras = new RequestOptions();

                        paras.params = f.data;
                        this.sub1=_this.auth.get(`${environment.sellerEnergyPurchaseApi}api/AHPurchaseExecute`,paras).subscribe(function (res) {
                            f.success(res.json());
                        });
                    }
                    },
                    pageSize: 5
                },

                pageable: {
                    pageSizes: true,
                    buttonCount: 5,
                    change: function () {
                        //resizeFunction();
                    }
                },
                noRecords: true,
                messages: {
                    noRecords: "没有相关记录！"
                },
                columns: [
                    { field: "purchasePlanName", title: "&ensp;", width: "450px",
                    template: function(item){
                        var str1 = "";

                        var str3 = "";
                        var str = `<div class="cM-box-list"><div class="list-box">
                            <div class="t-left float-l ma-l20">
                            <span class="color-9">计划名称：</span>
                            <span>${item.purchasePlanName}</span>
                            </div>
                            <div class="t-left float-l ma-l130">
                            <span class="color-9">交易中心：</span>
                            <span>${item.tradeCenterName}</span>
                            </div>
                            </div>`;

                        if (statusVal == 0) {
                            str1 = `<div class="td-l-box">
                                <p>
                                <span class="color-9">采购方式：</span>
                                <span>${item.purchasePlanStyle}</span>
                                </p>
                                <p>
                                <span class="color-9">用电时间：</span>
                                <span>${item.timeShow}</span>
                                </p>
                                <p>
                                <span class="color-9">采购电量：</span>
                                <span>${item.amount}万千瓦时</span>
                                </p>
                                <div class="size-14">
                                <span class="color-9">备注：</span>
                                <span class="remark">${item.remark}</span>
                                </div>
                                </div>`

                            if (item.purchasePlanType == 1)
                                str3 = `<div class="btn-box"><a data-id=${item.id} class="a-button-xian exec1">执行</a></div></div>`
                            else
                                str3 = `<div class="btn-box"><a data-id=${item.id} class="a-button-xian exec2">执行</a></div></div>`
                        }
                        if (statusVal == 1) {
                            str1 = `<div class="td-l-box">
                                <p>
                                <span class="color-9">采购方式：</span>
                                <span>${item.purchasePlanStyle}</span>
                                </p>
                                <p>
                                <span class="color-9">用电时间：</span>
                                <span>${item.timeShow}</span>
                                </p>
                                <p>
                                <span class="color-9">实购电量：</span>
                                <span>${item.actualPurchaseAmount}万千瓦时</span>
                                </p>
                                <p>
                                <span class="color-9">交易价格：</span>
                                <span>${item.dealPrice}元/千万时</span>
                                </p>
                                </div>`

                            if (item.purchasePlanType == 1)
                                str3 = `<div class="btn-box"><a data-id=${item.id} class="a-button-xian detail1">查看</a></div></div>`
                            else
                                str3 = `<div class="btn-box"><a data-id=${item.id} class="a-button-xian detail2">查看</a></div></div>`
                        }
                        return str + '<div class="b-box">'+str1 + str3 +'</div>';
                    }
                }
                ]
            });
        }

        var statusVal = 0;
        $(document).ready(function () {
            GetPurchaseList(statusVal, 0);
        });

        function ResetSearch() {
            $("#eq1").prop("checked", false);
            $("#eq2").prop("checked", false);
        }

        $(document).on("click", ".content-title a", function () {
            $("#searchVal").val("");
            ResetSearch();
            $(this).addClass("active").removeClass("color-9").siblings().removeClass("active").addClass("color-9");
            statusVal = $(this).attr("name");
            GetPurchaseList(statusVal, 0);
        });

        $("#iSearch").bind("click", function () {
            ResetSearch();
            GetPurchaseList(statusVal, 0);
            var filter = new Array();
            var grid = $("#grid").data("kendoGrid");
            var searchVal = $("#searchVal").val();
            if ($.trim(searchVal) != '')
                filter.push({ field: "purchasePlanName", operator: "contains", value: searchVal });
            grid.dataSource.filter(filter);
        });

        $("#searchButton").bind("click", function () {
            $("#searchVal").val("");
            var purchasePlanType = 0;

            if ($("#eq1").is(':checked'))
                purchasePlanType = 1;
            if ($("#eq2").is(':checked'))
                purchasePlanType = 2;
            if ($("#eq1").is(':checked') && $("#eq2").is(':checked'))
                purchasePlanType = 0;

            GetPurchaseList(statusVal, purchasePlanType);
        });

        $("#resetButton").bind("click", function () {
            ResetSearch();
        });

        //长协采购计划执行
        $("#grid").off("click", ".exec1").on("click", ".exec1", function () {
            _this.router.navigate(['/purchase/execute/anhui/detail',$(this).data("id")]);
        })
        //竞价采购计划执行
        $("#grid").off("click", ".exec2").on("click", ".exec2", function () {
            _this.router.navigate(['/purchase/execute/anhui/bid-detail',$(this).data("id")]);
        })
        //长协已执行的采购计划 详情
         $("#grid").off("click", ".detail1").on("click", ".detail1", function () {
            _this.router.navigate(['/purchase/execute/anhui/check/',$(this).data("id")]); //
        });
        //竞价已执行的采购计划 详情
         $("#grid").off("click", ".detail2").on("click", ".detail2", function () {
            _this.router.navigate(['/purchase/execute/anhui/bid-check/',$(this).data("id")]); //
        });
    }
        ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
    }
}