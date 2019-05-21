import { Component, OnInit, ViewEncapsulation,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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
    selector: 'report',
    templateUrl: './report.html',
    styleUrls: ['./report.css']
})
export class ReportComponent implements OnDestroy {
    sub1;sub2;
    constructor(private router: Router, private authService: AuthService, private http: Http) {

    }

    contractDetail={
        totatCount:0,
        uUnStartCount:0,
        executingCount:0,
        stopCount:0,
        expiringCount:0,
        longCount:0,
        bidCount:0,
        longAndBidCount:0,
        monthAddCount:0,
        threeMonthAddCount:0,
        yearAddCount:0,
        totalPreAmount:0,
        totalBuyAmount:0,
        totalUseAmount:0
    };

    ngOnInit() {
        $.showSide(10504);

        let _the = this;

_the.sub1=_the.authService.AuthGet(`${environment.sellerContractApi}api/AHContractOverview/GetData`, ).subscribe(function (res) {
            _the.contractDetail = res.json();
            
        });


        var filter = {
            advance: function () {

               let filters1 = [];
                let filters2 = [];
                if ($('#eq1').is(':checked'))
                    filters1.push('ContractType~eq~1');
                if ($('#eq2').is(':checked'))
                    filters1.push('ContractType~eq~2');

                if ($('#eq3').is(':checked'))
                    filters2.push('Status~eq~1');
                if ($('#eq4').is(':checked'))
                    filters2.push('Status~eq~0');
                if ($('#eq5').is(':checked'))
                    filters2.push('Status~eq~2');


                let filters3 = [];
                if ($('#conText').val() != '') {
                    filters3.push(`SerialNumber~contains~'${$('#conText').val()}'`);
                    filters3.push(`ContractName~contains~'${$('#conText').val()}'`);
                }

                let filters = [];
                if (filters1.length !== 0) {
                    filters.push(`(${filters1.join('~or~')})`);
                }
                if (filters2.length !== 0) {
                    filters.push(`(${filters2.join('~or~')})`);
                }
                if (filters3.length !== 0) {
                    filters.push(filters3.join('~or~'));
                }


                return filters;
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
                        var paras = new RequestOptions();
                        paras.params = f.data;
                        _the.sub2=_the.authService.AuthGet(`${environment.sellerContractApi}api/AHContractOverview/GetContrant`,f.data).subscribe(function (res) {
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
                pageSize:10
            },
            noRecords: true,
            messages: {
                noRecords: "当前没有任何数据"
            },
            columns: [
                { field: "SerialNumber", title: "合约编号",width:"150px" },
                { field: "ContractName", title: "合约名称" },
                { field: "ContractTypeString", title: "合约方式" },
                 { field: "ContractType", hidden:true },
                { field: "StatusString", title: "合约状态" },//color-blue
                { field: "PlansCountFixed", title: "签约电量<br />(万千瓦时)" },
                { field: "TotalLong", title: "长协电量<br />(万千瓦时)" },
                { field: "TotalBid", title: "竞价电量<br />(万千瓦时)" },
                // { field: "TradeCount", title: "已购电量<br />(万千瓦时)" },
                {
                    field: "StatusString", title: "状态",

                }
            ]
        });

          $(document).off("click", "#resetSeCondition").on("click", "#resetSeCondition", function () {
            $(this).parents(".filtrate-box").find("input[type='checkbox']").prop("checked", false);
        });
        $(document).off("click", "#selectCondition").on("click", "#selectCondition", function () {
            $("#filtrateBox").slideToggle(100);
        });

$("#iSearch").click(function () {
            var grid = $("#grid").data("kendoGrid");
            grid.dataSource.filter("");
        });

        $("#ibtnSearch").click(function () {
            var grid = $("#grid").data("kendoGrid");
            grid.dataSource.filter("");
        });
        
    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
    }
}