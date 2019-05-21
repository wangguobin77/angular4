
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../+common/services/auth.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';


import { environment } from '../../../../../environments/environment';

declare var $: any;
declare var kendo: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'edit',
    templateUrl: './edit.html',
    styleUrls: ['./edit.css']
})
export class EditComponent implements OnDestroy {
    sub1;sub2;sub3;sub4;
    constructor(private router: Router, private authService: AuthService, private http: Http, private route: ActivatedRoute) {

    }
    contractInfo = {
        longPacks: [],
        actualPurchaseAmountLong: 0,
        actualPurchaseAmountLongFixed: 0,
        distributedAmountLong: 0,
        distributedAmountLongFixed: 0,
        actualPurchaseAmountBid: 0,
        bidPlanId: "",
        actualPurchaseAmountBidFixed: 0,
        distributedAmountBid: 0,
        distributedAmountBidFixed: 0,
        actualPurchaseAmount: 0,
        type: 0,
        sqlRes: 0,
        year: 0,
        month: 0,
        undisLong: 0,
        undisBid: 0
    };

    parkInfo = {
        id: 0,
        subjectName: '',
        contractType: 0,
        contractTypeCN: '',
        bidAmount: 0,
        usedAmount: 0,
        dealAmount: 0
    };

    contractDate = {
        year: 0,
        month: 0
    };

    electricityDetail = {
        applyElectrictiyAmountFixed: 0,
        dealElectrictiyAmountFixed: 0,
        totalBidAmount: 0
    }

    sendData = {
         operatorId:  '',
        year: $("#contractyear").val(),
        month: $("#contractmonth").val(),
        distributeDataList: [],
        independentDistribute: [],
    };

    distribution = {
        type: 0,
        switch: (i) => {
            this.distribution.type = i;
        }
    };

    ngOnInit() {

        var _the = this;

        let id = _the.route.snapshot.params['date'];

        _the.contractDate.year = parseInt(id.substring(0, 4));
        _the.contractDate.month = parseInt(id.substring(4, id.length));

        _the.sendData.year = parseInt(id.substring(0, 4));
        _the.sendData.month = parseInt(id.substring(4, id.length));

        this.sub1=_the.authService.AuthGet(`${environment.sellerContractApi}api/SXPowerDistribution/GetParkDistributionsInfo/${_the.contractDate.year}/${_the.contractDate.month}`, ).subscribe(function (res) {
            _the.electricityDetail = res.json();
        });


        var gridfilter = {
            advance: function () {
                let filters3 = [];
                if ($('#SearchVal').val() != '') {
                    filters3.push(`SubjectName~eq~'${$('#SearchVal').val()}'`);
                }
                let filters = [];
                if (filters3.length !== 0) {
                    filters.push(filters3.join('~and~'));
                }

                return filters;
            },
            get: function () {
                return gridfilter.advance();
            }
        };

        $("#grid").kendoGrid({
            dataSource: {
                transport: {
                    read: function (f) {
                         f.data.filter = gridfilter.get();
                        var paras = new RequestOptions();
                        paras.params = f.data;
                        this.sub2=_the.authService.AuthGet(`${environment.sellerContractApi}api/SXPowerDistribution/GetParkInfo/${_the.contractDate.year}/${_the.contractDate.month}`, f.data).subscribe(function (res) {
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
                pageSize: 100
            },
            noRecords: true,
            messages: {
                noRecords: "当前没有任何数据"
            },
            columns: [
                {
                    field: "SubjectName", title: "园区名称",
                    template: function (dataItem) {
                        return dataItem.SubjectName;
                    },
                },
                { field: "ContractTypeCN", title: "合约方式" },
                { field: "BidAmountFixed", title: "申报电量<br/>（万千瓦时）" },
                { field: "UsedAmountFixed", title: "实用电量<br/>（万千瓦时）" },
                { field: "DealAmountFixed", title: "成交电量<br/>（万千瓦时）" },
                {
                    title: "操作",
                    template: function Formata(dataItem) {
                        var str = "<span style='cursor:pointer'  type='text' class='ipt_park' bidamount='" + dataItem.BidAmountFixed + "' dealamount='" + dataItem.DealAmountFixed + "'parkid='" + dataItem.id + "'subjectName='" + dataItem.SubjectName + "' >分配电量</span>";
                        return str;
                    }
                },
                { field: "ContractType", hidden: true },
                { field: "id", hidden: true },
            ]
        });

        //园区分配电量
        $(document).off("click", ".ipt_park").on("click", ".ipt_park", function (e) {
            //let para=id+"-"+
            var bid = $(this).attr("bidamount");
            var deal = $(this).attr("dealamount");
            var cyear = $("#contractyear").html();
            var cmonth = $("#contractmonth").html();
            var parkid = $(this).attr("parkid");
            var parkname = $(this).attr("subjectName");
            var param = bid + "-" + deal + "-" + cyear + "-" + cmonth + "-" + parkid + "-" + parkname;
            _the.router.navigate(['/sale/contractexecute/shanxi/park/' + param]);
        });



        function onOK() {

            $("tr[data-uid ='" + $("#parDataId").val() + "']").children().eq(4).text($("#usedEnergyAmountBox").val());
            var did = $("tr[data-uid ='" + $("#parDataId").val() + "']").children().eq(10).children("span").attr("longpid");
            var bid = $("tr[data-uid ='" + $("#parDataId").val() + "']").children().eq(10).children("span").attr("bidpid");

            // var cType = ($("tr[data-uid ='" + $("#parDataId").val() + "']").children().eq(1).text() === "长协" ? 1 : ($("tr[data-uid ='" + $("#parDataId").val() + "']").children().eq(1).text() === "竞价" ? 2 : 3));
            var cType = $("tr[data-uid ='" + $("#parDataId").val() + "']").children().eq(12).text();
            var userdpower = $("#usedEnergyAmountBox").data("kendoNumericTextBox").value();//实用电量 userdamount

            var dealpower = $("#purchasedEnergyAmountBox").data("kendoNumericTextBox").value();//成交电量 dealamount
            var currentusedpower = $("tr[data-uid ='" + $("#parDataId").val() + "']").children().eq(3).text();//当前实用电量

            var currentdealpower = $("tr[data-uid ='" + $("#parDataId").val() + "']").children().eq(4).text();//当前成交电量


            $("tr[data-uid ='" + $("#parDataId").val() + "']").children().eq(3).text(userdpower);
            $("tr[data-uid ='" + $("#parDataId").val() + "']").children().eq(4).text(dealpower);


        }

        var str = `<ul class="pd-20 dialog-c">
             <li>
             <p class="required">竞价预售电量：<span id="popBId"></span> 万千瓦时</p>
             <input type="hidden" id="parDataId" value="" />
             </li>
            <li>
             <p class="required">实用总电量</p>
             <div class="input-box unit-input-list">
             <input type="text" id="usedEnergyAmountBox" style="width:100%;height:34px;" placeholder="" style="width: 120px" /><span class="unit r-20">万千瓦时</span>
             </div>
             </li>
             <li>
             <p class="required">交易总电量</p>
             <div class="input-box unit-input-list">
             <input type="text" id="purchasedEnergyAmountBox" style="width:100%;height:34px;" placeholder="" style="width: 120px" /><span class="unit r-20">万千瓦时</span>
            </div>
            </li>
             </ul>`;
        var dialog1 = $('#dialog').kendoDialog({
            width: '450px',
            title: '提示',
            closable: true,
            modal: false,
            visibile: false,
            content: str,
            actions: [
                { text: '取消' },
                { text: '确认', primary: true, action: onOK }
            ]
        }).data('kendoDialog');

        dialog1.close();

         if (!$('#usedEnergyAmountBox').data('kendoNumericTextBox')) {
            $("#usedEnergyAmountBox").kendoNumericTextBox({
                format: "#.####",
                min: 0,
                decimals: 4
            });
            $("#purchasedEnergyAmountBox").kendoNumericTextBox({
                format: "#.####",
                min: 0,
                decimals: 4
            });
        }


        $("#iSearch").click(function () {

            var disyplayvalue = $('#grid').css("display");
            if (disyplayvalue == "none") {
                var grid1 = $('#grid1').data('kendoGrid');
                grid1.dataSource.filter('');
            } else {
                var grid = $('#grid').data('kendoGrid');
                grid.dataSource.filter('');
            }

        });

        var dlgContent = '<div class="text-center dialog-box">'
            + '<img src="/images/pic-warm.png">'
            + '<div style="line-height:24px;margin-top:20px;" id="dialogContent">'
            + '剩余未分配电量不合法！请重新调整！'
            + '</div>'
            + '</div>';
        var dialogSubmit = $('#dialogSubmit').kendoDialog({
            width: '450px',
            title: '提示',
            closable: true,
            modal: true,
            visibile: false,
            relocation: true,
            content: dlgContent,
            actions: [
                { text: '确认' }
            ]
        }).data('kendoDialog');

        dialogSubmit.close();

        var customerfilter = {
            advance: function () {
                let filters3 = [];
                if ($('#SearchVal').val() != '') {
                    filters3.push(`SubjectName~eq~'${$('#SearchVal').val()}'`);
                }
                let filters = [];
                if (filters3.length !== 0) {
                    filters.push(filters3.join('~and~'));
                }

                return filters;
            },
            get: function () {
                return customerfilter.advance();
            }
        };

        //独立客户
        $('#grid1').kendoGrid({
            dataSource: {
                transport: {
                    read: function (f) {
                        f.data.filter = customerfilter.get();
                        var paras = new RequestOptions();
                        paras.params = f.data;
                        this.sub3=_the.authService.AuthGet(`${environment.sellerContractApi}api/SXPowerDistribution/GetCustomerInfo/${_the.contractDate.year}/${_the.contractDate.month}`, f.data).subscribe(function (res) {
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
                pageSize: 100
            },
            noRecords: true,
            messages: {
                noRecords: '当前没有任何数据'
            },
            columns: [
                {
                    field: 'SubjectName', title: '园区客户名称',
                    template: function (dataItem) {
                        return dataItem.SubjectName;
                    },
                },
                { field: 'ContractTypeCN', title: '合约方式' },
                { field: 'BidAmountFixed', title: '申报电量<br/>（万千瓦时）' },
                { field: 'UsedAmountFixed', title: '实用电量<br/>（万千瓦时）' },
                { field: 'DealAmountFixed', title: '成交电量<br/>（万千瓦时）' },
                {
                    title: '操作',
                    template: function Formata(dataItem) {
                        var str = '<span style=\'cursor:pointer\' type=\'text\' class=\'ipt_undistributed\'   >分配电量</span>';
                        return str;
                    }
                },
                { field: 'ContractId', hidden: true },
                { field: 'ContractType', hidden: true },
                { field: 'PlanId', hidden: true },
                { field: 'SellerSubjectId', hidden: true },
            ]
        });

        //独立客户
        $(document).off('click', '.ipt_undistributed').on('click', '.ipt_undistributed', function (e) {
          //  let dataItem = $('#grid').data('kendoGrid').dataItem($(e.currentTarget).closest('tr')); //获取当前行
            //1.判断是否能够提交
            // if (dataItem.ContractType == "1," || dataItem.ContractType == "2," || dataItem.ContractType == "3," || dataItem.ContractType == "1,2,") {

            //   RecalcSumLongAndBid();
            let $this = $(this);
            $('#popBId').html($this.parent().siblings().eq(2).text());
            $('#parDataId').val($this.parent().parent().attr('data-uid'));
            $('#usedEnergyAmountBox').data('kendoNumericTextBox').value($this.parent().siblings().eq(3).text());
            $('#purchasedEnergyAmountBox').data('kendoNumericTextBox').value($this.parent().siblings().eq(4).text());
            $('#dialog').data('kendoDialog').open();
        });

        $('#submitDistribution').click(function () {

            $.each($('#grid1 tbody tr'), function (i, val) {

                var disData1 = {
                    sellerSubjectId: parseFloat($(this).children().eq(9).text()),
                    planId: $(this).children().eq(8).text(),
                    contractType: parseFloat($(this).children().eq(7).text()),
                    contractId: parseFloat($(this).children().eq(6).text()),
                    usedAmount: parseFloat($(this).children().eq(3).text()),
                };
                _the.sendData.independentDistribute.push(disData1);
            });

            let totleUrl = `${environment.sellerContractApi}api/SXPowerDistribution/SaveIndependentCustmomerInfo/`;
            let headers = new Headers({ 'Content-Type': 'application/json' });
            let options = new RequestOptions({ headers: headers });

            this.sub4=_the.authService.AuthPost(totleUrl, _the.sendData)
                .subscribe((res) => {
                    let result = res.json();
                    alert(result.msg);
                    console.log(result);
                })
        });

        //公共函数
        function add(a, b) {
            var c, d, e;
            try {
                c = a.toString().split('.')[1].length;
            } catch (f) {
                c = 0;
            }
            try {
                d = b.toString().split('.')[1].length;
            } catch (f) {
                d = 0;
            }
            return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
        }

        function sub(a, b) {
            var c, d, e;
            try {
                c = a.toString().split('.')[1].length;
            } catch (f) {
                c = 0;
            }
            try {
                d = b.toString().split('.')[1].length;
            } catch (f) {
                d = 0;
            }
            return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
        }

        function mul(a, b) {
            var c = 0,
                d = a.toString(),
                e = b.toString();
            try {
                c += d.split('.')[1].length;
            } catch (f) { }
            try {
                c += e.split('.')[1].length;
            } catch (f) { }
            return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c);
        }

        function div(a, b) {
            var c, d, e = 0,
                f = 0;
            try {
                e = a.toString().split('.')[1].length;
            } catch (g) { }
            try {
                f = b.toString().split('.')[1].length;
            } catch (g) { }
            return c = Number(a.toString().replace('.', '')), d = Number(b.toString().replace('.', '')), mul(c / d, Math.pow(10, f - e));
        }
    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe();}
        if (this.sub4 !== undefined && this.sub4 !== null) { this.sub4.unsubscribe();}
    }
}