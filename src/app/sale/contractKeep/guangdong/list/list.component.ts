import { Component, OnInit, ViewEncapsulation ,OnDestroy } from '@angular/core';
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
    selector: 'list',
    templateUrl: './list.html',
    styleUrls: ['./list.css']
})
export class ListComponent implements OnDestroy{
    sub1;
    constructor(private router: Router, private authService: AuthService, private http: Http) {

    }

    ngOnInit() {
        $.showSide(10503);
        var _the = this;


        $(document).off("click", "#resetSeCondition").on("click", "#resetSeCondition", function () {
            $(this).parents(".filtrate-box").find("input[type='checkbox']").prop("checked", false);
        });
        $(document).off("click", "#selectCondition").on("click", "#selectCondition", function () {
            $("#filtrateBox").slideToggle(100);
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
                if ($('#conText').val()!='') {
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
                        _the.sub1=_the.authService.AuthGet(`${environment.sellerContractApi}api/GDContractFiling/GDGetContrant`, f.data).subscribe(function (res) {
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
                { field: "SerialNumber", title: "合约编号" },
                { field: "ContractName", title: "合约名称" },
                { field: "ContractTypeString", title: "合约方式" },
                { field: "StatusString", title: "合约状态" },//color-blue
                {
                    field: "ContractId", title: "相关",

                    // template: //"<a href='/sale/anhui/contractKeep/detail/' class='color-blue'>查看</a>", 
                    template: function (dataItem) {
                        var linkparam = dataItem.ContractId;
                        return '<a class="color-exactGreen size-16 cur-p clearing" val="' + linkparam + '">查看</a>';
                    },
                    width: "20%"
                }
            ]
        });

        $("#grid").off("click", "a.color-exactGreen").on("click", "a.color-exactGreen", function () {
            var date = $(this).attr("val");
            _the.router.navigate([`/sale/contractkeep/guangdong/detail/${date}`]);
        });

        $("#iSearch").click(function () {
            var grid = $("#grid").data("kendoGrid");
            grid.dataSource.filter("");
        });
        $("#iSearchName").click(function () {
            var grid = $("#grid").data("kendoGrid");
            grid.dataSource.filter("");
        });
    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
    }
}