import { Component, OnInit, ViewEncapsulation , OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../+common/services/auth.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import { State } from '@progress/kendo-data-query';
import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';

import { Observable } from 'rxjs/Rx';
import { environment } from '../../../../../environments/environment';

declare var $: any;
declare var kendo: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'list',
    templateUrl: './list.html',
    styleUrls: ['./list.css']
})
export class ListComponent implements OnDestroy {
    sub1;

    constructor(private router: Router, private authService: AuthService, private http: Http) {

    }

    ngOnInit() {

        var _this = this;

        $("#years").kendoDropDownList({
            dataTextField: "planYear",
            dataValueField: "planYear",
            dataSource: {
                transport: {
                    read: function (f) {
                        this.sub1=_this.authService.AuthGet(`${environment.sellerContractApi}api/AHPowerDistribution/AHContractExecuteYear`).subscribe(function (res) {
                            f.success(res.json());
                        });
                    }
                }
            },
        });
        $("#years").data("kendoDropDownList").value(new Date().getFullYear());

        var filter = {
            advance: function () {
                var filters1 = [];
                var year = $("#years").data("kendoDropDownList").value();
                if (year != "") {
                    filters1.push(`PlanYear~eq~${year}`);
                    return filters1.join("");
                }
                return "";
            },
            get: function () {
                return filter.advance();
            }
        };


        $("#grid").kendoGrid({
            dataSource: {
                transport: {
                    read: function (f) {
                        f.data.filter = filter.get();
                        this.sub1=_this.authService.AuthGet(`${environment.sellerContractApi}api/AHPowerDistribution/AHGetPurchasePlan`, f.data).subscribe(function (res) {
                            f.success(res.json());
                        });
                    }
                },
                schema: {
                    data: function (response) {
                        return response.Data;
                    },
                    total: function (response) {
                        return response.Total;
                    }
                },
                serverPaging: true,
                serverFiltering: true
            },
            pageable: {
                pageSizes: true,
                buttonCount: 5,
                pageSize: 15
            },
            //filterable: {
            //    extra: false
            //},
            noRecords: true,
            messages: {
                noRecords: "当前没有任何数据"
            },
            columns: [
                {
                    field: "PlanMonth", title: "用电周期",
                    template: function (dataItem) {
                        return dataItem.PlanMonth + "月";
                    },
                    width: "270px"
                },
                {
                    field: "PlanYear", title: "售电合约类型",
                    template: function () {
                        return '<p class="plan-list">长协</p><p class="line plan-list">竞价</p>'
                    },
                    width: "160px"
                },
                {
                    field: "PlanYear", title: "总预购电量<p>(万千瓦时)</p>",
                    template: function (dataItem) {
                        var isexecute = 0;
                        if (isexecute == 0 || dataItem.Opreator != '' && dataItem.Opreator != null) {
                            return '<p class="data-list">' + (dataItem.LongAmount / 100000000).toFixed(4) + '</p><p class="line data-list">' + (dataItem.BidAmount / 100000000).toFixed(4) + '</p>'
                        } else {
                            return '<p class="data-list">--</p><p class="line data-list">--</p>'
                        }
                    }
                },
                {
                    field: "PlanYear", title: "总实用电量<p>(元)</p>",
                    template: function (dataItem) {
                        if (dataItem.Opreator != '' && dataItem.Opreator != null) {
                            return (dataItem.LongActualUsedAmount / 100000000).toFixed(4);
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: "PlanYear", title: "总交易电量<p>(万千瓦时)</p>",
                    template: function (dataItem) {
                        if (dataItem.Opreator != '' && dataItem.Opreator != null) {
                            return '<p class="right-list">' + (dataItem.LongActualPurchaseAmount / 100000000).toFixed(4) + '</p><p class="line right-list">' + (dataItem.BidActualPurchaseAmount / 100000000).toFixed(4) + '</p>';
                        } else {
                            return '<p class="right-list">--</p><p class="line right-list">--</p>';
                        }
                    }
                },
                { field: "UnitsInStock", title: "状态" },
                {
                    field: "Opreator", title: "操作员",
                    template: function (dataItem) {
                        if (dataItem.Opreator != '' && dataItem.Opreator != null) {
                            return dataItem.Opreator;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: "FormatCreateDate", title: "最后操作时间",
                    template: function (dataItem) {
                        if (dataItem.Opreator != '' && dataItem.Opreator != null) {
                            return dataItem.FormatCreateDate;
                        } else {
                            return "--";
                        }
                    }
                },
                {
                    field: "Opreator", title: "操作",
                    template: function (dataItem) {
                        var linkparam = dataItem.PlanYear + "" + dataItem.PlanMonth;
                        if (dataItem.PlanMonth < 10) {
                            linkparam = dataItem.PlanYear + "0" + dataItem.PlanMonth;
                        }
                        return '<a class="color-exactGreen size-16 cur-p clearing" val="' + linkparam + '">执行</a>';
                    },
                    width: "140px"
                }
            ]
        });

        $("#grid").off("click", "a.color-exactGreen").on("click", "a.color-exactGreen", function () {
            var date = $(this).attr("val");
            _this.router.navigate([`/sale/contractexecute/anhui/edit/${date}`]);
        });

        $("#years").change(function () {
            var grid = $("#grid").data("kendoGrid");

            grid.dataSource.filter("");
        });
    }
ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
    }
}