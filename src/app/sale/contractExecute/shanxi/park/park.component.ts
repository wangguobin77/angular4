import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../+common/services/auth.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';


import { environment } from '../../../../../environments/environment';

declare var $: any;
declare var kendo: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'park',
    templateUrl: './park.html',
    styleUrls: ['./park.css']
})
export class ParkComponent implements OnDestroy {
    sub1; sub2; sub3;
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

    customerDetail = {
        subjectName: "",
        subjectId0: 0,
        contractType: "",
        contractTypeCN: "",
        bidAmountFixed: 0,
        distributedAmount: 0,
        planId: "",
        customerId: 0,
        dealAmountFixed: 0
    };

    sendData = {
         operatorId: '',
        year: 2017,
        month: 7,
        distributeDataList: []
    };


    paramDetail = {
        bidamount: 0,
        dealamount: 0,
        year: 0,
        month: 0,
        parkid: 0,
        parkname: ""
    };

    powerinfo = {
        hasassignment: 0,
        leftpower: 0
    };

    ngAfterViewInit() {

        // 测试数据 2017年1月份  总申报是父级1000，总成交为100 园区id是4

        var _the = this;

        let id = _the.route.snapshot.params['date'];
        let arr = id.split('-');

        _the.paramDetail.bidamount = arr[0];
        _the.paramDetail.dealamount = arr[1];
        _the.paramDetail.year = arr[2];
        _the.paramDetail.month = arr[3];
        _the.paramDetail.parkid = arr[4];
        _the.paramDetail.parkname = arr[5];
        let year = _the.paramDetail.year;
        let month = _the.paramDetail.month;
        let sellerParkid = _the.paramDetail.parkid;
        _the.sendData.year = year;
        _the.sendData.month = month;

        // _the.authService.AuthGet(`${environment.sellerContractApi}api/AHPowerDistribution/AHDistributionDetails/${id}`).subscribe(function (res) {
        //     _the.contractInfo = res.json();
        //     var undisLong = _the.contractInfo.actualPurchaseAmountLongFixed - _the.contractInfo.distributedAmountLongFixed;
        //     var undisBid = _the.contractInfo.actualPurchaseAmountBidFixed - _the.contractInfo.distributedAmountBidFixed;
        //     _the.contractInfo.undisLong = (undisLong > 0 ? undisLong : 0);
        //     _the.contractInfo.undisBid = (undisBid > 0 ? undisBid : 0);
        // });

        var filter = {
            advance: function () {
                var filters4 = [];
                var ctype = "";
                if (ctype != "") {
                    filters4.push(`ContractType~contains~${ctype}`);
                }
                var filters3 = [];
                var cName = $("#SearchVal").val();
                if (cName != "") {
                    filters3.push(`SubjectName~contains~'${cName}'`);
                }

                var filters = [];
                if (filters4.length != 0) {
                    filters.push(filters4.join("~and~"));
                }
                if (filters3.length != 0) {
                    filters.push(filters3.join("~and~"));
                }

                return filters.join("~and~");
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
                        _the.authService.AuthGet(`${environment.sellerContractApi}api/SXPowerDistribution/GetParkCustomerInfo/${year}/${month}/${sellerParkid}`, f.data).subscribe(function (res) {
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
            dataBound: onDataBound,
            noRecords: true,
            messages: {
                noRecords: "当前没有任何数据"
            },
            columns: [
                {
                    field: "SubjectName", title: "园区客户名称",
                    template: function (dataItem) {
                        return dataItem.SubjectName;
                    },
                },
                { field: "BidAmountFixed", title: "申报电量<br/>（万千瓦时）" },
                { field: "UsedAmountFixed", title: "实用电量<br/>（万千瓦时）" },
                { field: "DealAmountFixed", title: "成交电量<br/>（万千瓦时）" },
                {
                    title: "操作",
                    template: function Formata(dataItem) {
                        var str = "<span style='cursor:pointer type='text' class='ipt_undistributed'  >分配电量</span>";
                        return str;
                    }
                },
                { field: "SubjectId", hidden: true },
                { field: "ContractType", hidden: true },
                { field: "PlanId", hidden: true },
                { field: "SellerParkId", hidden: true },
            ]
        });


        $(document).off("click", ".ipt_undistributed").on("click", ".ipt_undistributed", function (e) {

            var dataItem = $("#grid").data("kendoGrid").dataItem($(e.currentTarget).closest("tr")); //获取当前行

            let $this = $(this);

            $("#parDataId").val($this.parent().parent().attr("data-uid"));

            $('#usedEnergyAmountBoxPark').data("kendoNumericTextBox").value($("tr[data-uid ='" + $("#parDataId").val() + "']").children().eq(2).text());
            $("#purchasedEnergyAmountBoxPark").data("kendoNumericTextBox").value($("tr[data-uid ='" + $("#parDataId").val() + "']").children().eq(3).text());
            $("#dialogpark").data("kendoDialog").open();
        });



        let str = `<ul class="pd-20 dialog-c">
             <li>
             <p class="required">可分配交易电量：<span id="pop">(${_the.contractInfo.undisLong} )</span> 万千瓦时</p>
             <input type="hidden" id="parDataId" value="" />
             </li>
            <li>
             <p class="required">实用总电量</p>
             <div class="input-box unit-input-list">
             <input type="text" id="usedEnergyAmountBoxPark" style="width:100%;height:34px;" placeholder="" style="width: 120px" /><span class="unit r-20">万千瓦时</span>
             </div>
             </li>
             <li>
             <p class="required">成交总电量</p>
             <div class="input-box unit-input-list">
             <input type="text" id="purchasedEnergyAmountBoxPark" style="width:100%;height:34px;" placeholder="" style="width: 120px" /><span class="unit r-20">万千瓦时</span>
            </div>
            </li>
             </ul>`;
        let dialogpark = $('#dialogpark').kendoDialog({
            width: '450px',
            title: '提示',
            closable: true,
            modal: false,
            visibile: false,
            content: str,
            actions: [
                { text: '取消' },
                {
                    text: '确认', primary: true, action: function() {
                        debugger;
                        var totalpower = parseFloat($("#totalpower").text());//获取总成交电量 totalpower

                        var assignpower = parseFloat($("#hasassignment").text());//获取已分配电量 assignpower

                        var leftpower = parseFloat($("#leftpower").text());//剩余电量leftpower

                        var userdpower = $("#usedEnergyAmountBoxPark").data("kendoNumericTextBox").value();//实用电量 userdamount

                        var dealpower = $("#purchasedEnergyAmountBoxPark").data("kendoNumericTextBox").value();//成交电量 dealamount

                        var currentusedpower = $("tr[data-uid ='" + $("#parDataId").val() + "']").children().eq(2).text();//当前实用电量

                        var currentdealpower = $("tr[data-uid ='" + $("#parDataId").val() + "']").children().eq(3).text();//当前成交电量

                        $("#hasassignment").html(add(assignpower, sub(dealpower, currentdealpower)));//已分配=当前已分配+（当前成交-填入值）
                        $("#leftpower").html(sub(totalpower, parseFloat($("#hasassignment").text())));

                        $("tr[data-uid ='" + $("#parDataId").val() + "']").children().eq(2).text(userdpower);
                        $("tr[data-uid ='" + $("#parDataId").val() + "']").children().eq(3).text(dealpower);
                        $('#dialogpark').data('kendoDialog').close();
                    }
                }
            ]
        }).data('kendoDialog');

        dialogpark.close();

        if (!$('#usedEnergyAmountBoxPark').data('kendoNumericTextBox')) {
            $("#usedEnergyAmountBoxPark").kendoNumericTextBox({
                format: "#.####",
                min: 0,
                decimals: 4
            });
            $("#purchasedEnergyAmountBoxPark").kendoNumericTextBox({
                format: "#.####",
                min: 0,
                decimals: 4
            });
        }

        $('#submitDistribution').click(function () {

            let totaldeal = 0;
            $.each($('tbody tr'), function (i, val) {
                totaldeal = add(parseFloat($(this).children().eq(3).text()), totaldeal);
            });

             if (totaldeal !== parseFloat($('#totalpower').text())) {
                alert('分配有误请重新分配');
            } else {
 _the.sendData.distributeDataList = [];

            $.each($('tbody tr'), function (i, val) {

                let disData1 = {
                    subjectName: $(this).children().eq(0).text(),
                    bidAmount: mul(parseFloat($(this).children().eq(1).text()), 100000000),
                    dealAmount: mul(parseFloat($(this).children().eq(3).text()), 100000000),
                    usedAmount: mul(parseFloat($(this).children().eq(2).text()), 100000000),
                    sellerSubjectId: parseFloat($(this).children().eq(5).text()),
                    contractType: parseFloat($(this).children().eq(6).text()),
                    planIdBid: $(this).children().eq(7).text(),
                    sellerParkId: $(this).children().eq(8).text(),
                };
                _the.sendData.distributeDataList.push(disData1);
            });
            let totleUrl = `${environment.sellerContractApi}api/SXPowerDistribution/SaveParkCustomerInfo/`;
            let headers = new Headers({ 'Content-Type': 'application/json' });
            let options = new RequestOptions({ headers: headers });

            this.sub2 = _the.authService.AuthPost(totleUrl, _the.sendData)
                .subscribe((res) => {
                    const result = res.json();
                     alert(result.msg);
                    console.log(result);
                })

            }

           
        });

        $('#iSearch').bind('click', function () {
            const grid = $('#grid').data('kendoGrid');
            grid.dataSource.filter('');
        });

        function onDataBound() {
            var result;
            var year = _the.paramDetail.year.toString();
            var month = _the.paramDetail.month.toString();
            var parkid = _the.paramDetail.parkid.toString();
            let checkUrl = `${environment.sellerContractApi}api/SXPowerDistribution/CheckPurchasedDistributions/${year}/${month}/${parkid}`;

            this.sub3 = _the.authService.AuthGet(checkUrl).subscribe(
                (res) => {
                    result = res.json();
                    var totalpower = parseFloat($("#totalpower").text());//当前总成交电量
                    var gridlength = 0;
                    var totalapply = 0;
                    var hasassigned = 0;
                    var left = 0;
                    if (result.result == false) {

                        $("tbody tr").each(function (index, item) {
                            totalapply = totalapply + parseFloat($(this).children().eq(1).text());
                            gridlength = gridlength + 1;
                        });
                        $("tbody tr").each(function (index, item) {
                            if (index < gridlength - 1) {
                                var rate = div(parseFloat($(this).children().eq(1).text()), totalapply); //计算申报电量的百分百
                                var result = mul(rate, totalpower);//根据百分百求成交电量
                                hasassigned = (hasassigned + parseFloat(result.toFixed(4)));//已分配
                                left = totalpower - hasassigned;
                                $("#leftpower").html(left);
                                $("#hasassignment").html(hasassigned);//当前已分配

                                $(this).children().eq(3).text(result.toFixed(4));
                            }
                            else {
                                //分配到最后一项,总分配-已分配
                                var result = totalpower - hasassigned;//最后一项取剩下的所有电
                                hasassigned = hasassigned + result;//已分配
                                $("#hasassignment").html(hasassigned);//当前已分配
                                left = totalpower - hasassigned;//剩余电量=总量-已分配
                                $("#leftpower").html(left.toFixed(4));//剩余电量
                                $(this).children().eq(3).text(result.toFixed(4));

                            }
                        });

                    }
                    else {

                        $("tbody tr").each(function (index, item) {
                            totalapply = totalapply + parseFloat($(this).children().eq(1).text());
                            gridlength = gridlength + 1;

                            hasassigned = hasassigned + parseFloat($(this).children().eq(3).text());
                            $("#hasassignment").html(hasassigned);
                            left = totalpower - hasassigned;
                            $("#leftpower").html(left);
                        });

                    }

                    console.log(result);
                }
            );


        }



        const dlgContent = '<div class="text-center dialog-box">'
            + '<img src="/images/pic-warm.png">'
            + '<div style="line-height:24px;margin-top:20px;" id="dialogContent">'
            + '剩余未分配电量不合法！请重新调整！'
            + '</div>'
            + '</div>';
        const dialogSubmit = $('#dialogparkSubmit').kendoDialog({
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

        function add(a, b) {
            let c, d, e;
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
            let c, d, e;
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
            let c = 0,
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
            let c, d, e = 0,
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
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe(); }
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe(); }
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe(); }
    }
}