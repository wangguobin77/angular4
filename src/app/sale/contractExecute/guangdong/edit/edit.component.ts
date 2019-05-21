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

    sendData = {
        operatorId:"",
        year: $("#contractyear").val(),
        month: $("#contractmonth").val(),
        distributeDataList: []
    };

    ngOnInit() {
        var _the = this;

        let id = _the.route.snapshot.params['date'];

        let year = parseInt(id.substring(0, 4));
        let month = parseInt(id.substring(4, id.length));

        _the.sendData.year = year;
        _the.sendData.month = month;

        _the.sub1 = _the.authService.AuthGet(`${environment.sellerContractApi}api/GDPowerDistribution/GDDistributionDetails/${id}`).subscribe(function (res) {
            _the.contractInfo = res.json();
            var undisLong = _the.contractInfo.actualPurchaseAmountLongFixed - _the.contractInfo.distributedAmountLongFixed;
            var undisBid = _the.contractInfo.actualPurchaseAmountBidFixed - _the.contractInfo.distributedAmountBidFixed;
            _the.contractInfo.undisLong = (undisLong > 0 ? undisLong : 0);
            _the.contractInfo.undisBid = (undisBid > 0 ? undisBid : 0);
        });

        var contractDate = [
            { text: "全部售电合约", value: "" },
            { text: "长协", value: "1," },
            { text: "竞价", value: "2," },
            { text: "长协,竞价", value: "1,2," }
        ];

        $("#contract").kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: contractDate,
            optionLabel: "--全部售电合约--"
        });

        var filter = {
            advance: function () {
                var filters4 = [];
                var ctype = $("#contract").data("kendoDropDownList").value();
                if (ctype != "") {
                    filters4.push(`ContractType~contains~'${ctype}'`);
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
                        _the.sub2 = _the.authService.AuthGet(`${environment.sellerContractApi}api/GDPowerDistribution/GDGetContractPlans/${year}/${month}`, f.data).subscribe(function (res) {
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
                    field: "SubjectName", title: "用电主体名称",
                    template: function (dataItem) {
                        return dataItem.SubjectName;
                    },
                },
                { field: "ContractTypeCN", title: "合约方式" },
                { field: "LongAmountFixed", title: "长协预售电量<br/>（万千瓦时）" },
                { field: "BidAmountFixed", title: "竞价预售电量<br/>（万千瓦时）" },
                { field: "DistributedAmountFixed", title: "实用总电量<br/>（万千瓦时）" },
                { field: "LongActualPurchaseAmountFixed", title: "长协交易电量<br/>（万千瓦时）" },
                { field: "BidActualPurchaseAmountFixed", title: "竞价交易电量<br/>（万千瓦时）" },
                { field: "LongPurchasePlanId", hidden: true },
                { field: "BidPurchasePlanId", hidden: true },
                { field: "ContractId", hidden: true },
                {

                    template: function Formata(dataItem) {
                        if (dataItem.LongPurchasePlanId == null || dataItem.LongPurchasePlanId == "") {
                            dataItem.LongPurchasePlanId = "00000000-0000-0000-0000-000000000000";
                        }
                        if (dataItem.BidPurchasePlanId == null || dataItem.BidPurchasePlanId == "") {
                            dataItem.BidPurchasePlanId = "00000000-0000-0000-0000-000000000000";
                        }
                        if (dataItem.LongAmountFixed == "")
                            dataItem.LongAmountFixed = 0;
                        if (dataItem.BidAmountFixed == "")
                            dataItem.BidAmountFixed = 0;
                        if (dataItem.LongPurchasedAmountFixed == "")
                            dataItem.LongPurchasedAmountFixed = 0;
                        if (dataItem.BidActualPurchaseAmountFixed == "")
                            dataItem.BidActualPurchaseAmountFixed = 0;
                        var str = "<span style='cursor:pointer' data-long='" + dataItem.LongActualPurchaseAmountFixed + "' data-bid='" + dataItem.BidActualPurchaseAmountFixed + "' type='text' class='ipt_undistributed'   ContractId='" + dataItem.SubUserId + "' LongPId ='" + dataItem.LongPurchasePlanId + "'  BidPId ='" + dataItem.BidPurchasePlanId + "'  LongAmountFix ='" + dataItem.LongAmountFixed + "'  BidAmountFix ='" + dataItem.BidAmountFixed + "'>分配电量</span>";
                        //var str = "<span style='cursor:pointer'  type='text' class='ipt_undistributed'>分配电量</span>";

                        return str;
                    }
                },
                { field: "SubUserId", hidden: true },
                { field: "ContractType", hidden: true },
                { field: "BidPurchasedAmountFixed", hidden: true },
                { field: "LongPurchasedAmountFixed", hidden: true },
            ]
        });


        $(document).off("click", ".ipt_undistributed").on("click", ".ipt_undistributed", function (e) {

            var dataItem = $("#grid").data("kendoGrid").dataItem($(e.currentTarget).closest("tr"));//获取当前行
            //1.判断是否能够提交
            if (dataItem.ContractType == "1," || dataItem.ContractType == "2," || dataItem.ContractType == "3," || dataItem.ContractType == "1,2,") {

            } else {
                $("#dialogContent").text("该合约数据有误，无法为其分配电量！");
                $("#dialogSubmit").data("kendoDialog").open();
                return false;
            }
            //保存ID

            //   RecalcSumLongAndBid();
            let $this = $(this);
            // let $domThis = $(this);
            $("#popLong").html($this.parent().siblings().eq(2).text());
            $('#popBId').html($this.parent().siblings().eq(3).text());
            var untotal = add(parseFloat($("#undLongAmount").html()), parseFloat($("#undBidAmount").html()));
            $("#pop").text(untotal);

            var sumLong = 0;
            sumLong = add(sumLong, parseFloat($("#needTobeDistriAmountLong").text()));
            var sumBid = 0;
            sumBid = add(sumBid, parseFloat($("#needTobeDistriAmountBid").text()));

            $("#parDataId").val($this.parent().parent().attr("data-uid"));
            $("#usedEnergyAmountBox").data("kendoNumericTextBox").value($this.parent().siblings().eq(4).text());
            $("#purchasedEnergyAmountBox").data("kendoNumericTextBox").value(parseFloat($this.parent().siblings().eq(5).text()) + parseFloat($this.parent().siblings().eq(6).text()));
            $("#dialog").data('kendoDialog').open();

        });

        function onOK() {



            var cType = $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(12).text();
            // 长协，竞价，长协+竞价
            // 1.获取总电量，获取未分配电量，获取Grid中长协，竞价电量
            // 1.长协总电量
            var totalLong = parseFloat($('#needTobeDistriAmountLong').text());
            var totalBid = parseFloat($('#needTobeDistriAmountBid').text());
            // 2.长协已分配
            var isbidLong = parseFloat($('#dLongAmount').text());
            // 2.长协未分配
            var notbidLong = parseFloat($('#undLongAmount').text());

            // 2.竞价已分配
            var isbid = parseFloat($('#dBidAmount').text());
            // 2.竞价未分配
            var notbid = parseFloat($('#undBidAmount').text());

            // 3.长协当前已分配的值
            var gridtLong = parseFloat($('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(5).text());
            // 3.竞价当前已分配的值
            var gridBid = parseFloat($('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(6).text());
            // 4.长协预售
            var sellLong = parseFloat($('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(2).text());
            // 5.竞价预售
            var sellBid = parseFloat($('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(3).text());

            var currentData = parseFloat($('#purchasedEnergyAmountBox').data('kendoNumericTextBox').value());
            var usedtData = parseFloat($('#usedEnergyAmountBox').data('kendoNumericTextBox').value());

            if (currentData > usedtData) {
                alert('交易电量不能大于实际用电量');
                return false;
            }
            if (cType == '2,') {
                //1.已分竞价  未分竞价
                //输入的值  输入的值-原先的值
                var cdata = sub(currentData, gridBid);

                $('#undBidAmount').text(sub(notbid, cdata));//未分配的电量              
                $('#dBidAmount').text(add(isbid, cdata));//已分配的电量

                $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(4).text($('#usedEnergyAmountBox').data('kendoNumericTextBox').value());
                $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(6).text(currentData);
                $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('data-bid', $('#purchasedEnergyAmountBox').data('kendoNumericTextBox').value());
            } else if (cType == '1,2,' || cType == '1,') {


                //1.未超过长协预售电量
                if (currentData <= sellLong) {
                    // 1.1未分配电量=未分配电量+Grid长协值-输入框中的值
                    var undispower = sub(add(notbidLong, gridtLong), currentData);
                    // 1.2 已分配电量=总量-未分配
                    var dispower = sub(totalLong, undispower);
                    $('#dLongAmount').text(dispower); // 已分配
                    $('#undLongAmount').text(undispower);// 未分配
                    $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(5).text($('#purchasedEnergyAmountBox').data('kendoNumericTextBox').value());

                    // 清除竞价数据
                    $('#dBidAmount').text(sub(isbid, gridBid));
                    //_the.contractInfo.distributedAmountBidFixed = _the.contractInfo.distributedAmountBidFixed - gridBid;
                    $('#undBidAmount').text(add(notbid, gridBid));
                    
                    $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(6).text(0);
                    $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(4).text($('#usedEnergyAmountBox').data('kendoNumericTextBox').value());
                    $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('data-long', $('#usedEnergyAmountBox').data('kendoNumericTextBox').value());
                    $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('data-long', 0);
                }
                else {
                    // 2.交易总电量超过了长协预售  长协交易电量=预售电量  竞价交易=填入值-长协预售
                    var disbid=(sub(currentData,sellLong));// 竞价交易=填入值-长协预售

                    //长协已分配=当前已分配+(输入值-长协grid)
                    //竞价部分=输入值-长协预售
                    var cbdata=sub(currentData,sellLong);
                    if (gridtLong < sellLong) {
                        
                        $('#dLongAmount').text(add(isbidLong, sellLong));
                        $('#undLongAmount').text(sub(notbidLong, sellLong));

                        $('#undBidAmount').text(sub(notbid,cbdata));//未分配的电量              
                        $('#dBidAmount').text(add(isbid,cbdata));//已分配的电量
                    }else{
                       
                      
                       var cbiddata=sub(sub(currentData,sellLong),gridBid);

                        $('#undBidAmount').text(sub(notbid,cbiddata));//未分配的电量              
                        $('#dBidAmount').text(add(isbid,cbiddata));//已分配的电量
                    }

                  

                    $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(4).text($('#usedEnergyAmountBox').data('kendoNumericTextBox').value());
                    $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(5).text(sellLong);
                    $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(6).text(disbid);
                    $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('data-long', sellLong);
                    $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('data-long', disbid);
                    // 竞价分配电量=总竞价+（当前-分配）
                }

                $('#dialog').data('kendoDialog').close();
            } else {
                $("#dialogContent").text("该合约数据有误，无法为其分配电量！");
                $("#dialogSubmit").data("kendoDialog").open();
                $("#dialog").data("kendoDialog").close();
            }
        }

        var str = '<ul class="pd-20 dialog-c">'
            + '<li>'
            + '<p class="required">长协预售电量：<span id="popLong"></span> 万千瓦时</p>'
            + '<p class="required">竞价预售电量：<span id="popBId"></span> 万千瓦时</p>'
            + '<p class="required">可分配交易电量：<span id="pop"></span> 万千瓦时</p>'
            + '<input type="hidden" id="parDataId" value="" />'
            + '</li>'
            + '<li>'
            + '<p class="required">实用总电量</p>'
            + '<div class="input-box unit-input-list">'
            + '<input type="text" id="usedEnergyAmountBox" style="width:100%;height:34px" placeholder="" /><span class="unit r-20">万千瓦时</span>'
            + '</div>'
            + '</li>'
            + '<li>'
            + '<p class="required">交易总电量</p>'
            + '<div class="input-box unit-input-list">'
            + '<input type="text" id="purchasedEnergyAmountBox" style="width:100%;height:34px" placeholder="" /><span class="unit r-20">万千瓦时</span>'
            + '</div>'
            + '</li>'
            + '</ul>';
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

        $('#submitDistribution').click(function () {
            _the.sendData.distributeDataList = [];
            //validate
            var unlong = parseFloat($("#undLongAmount").html())
            var unbid = parseFloat($("#undBidAmount").html())
            if (unlong < 0 || unbid < 0) {
                alert('已超出未分配电量最小值0，请核对');
                return false;
            } else {
                $.each($('tbody tr'), function (i, val) {
                    var cType = $(this).children().eq(12).text();
                    if (cType == '1,2,' || cType == '2,1,') {
                        var disData1 = {
                            id: 0,
                            distributedLong: parseFloat($(this).children().eq(5).text()),
                            distributedBid: 0,
                            used: parseFloat($(this).children().eq(4).text()),
                            contractType: 1,
                            planIdLong: $(this).children().eq(7).text(),
                            planIdBid: '00000000-0000-0000-0000-000000000000',
                            actualPurchasedLong: parseFloat($(this).children().eq(10).children('span[class=ipt_undistributed]').attr('data-long')),
                            actualPurchasedBid: 0,
                            sellerSubjectId: $(this).children().eq(11).text(),
                            deviationRate: 0,
                            userMargin: 0,
                            sellerMargin: 0,
                            usedAmount: 0
                        };
                        _the.sendData.distributeDataList.push(disData1);
                        var disData2 = {
                            id: 0,
                            distributedLong: 0,
                            distributedBid: parseFloat($(this).children().eq(6).text()),
                            used: parseFloat($(this).children().eq(4).text()),
                            contractType: 2,
                            planIdLong: '00000000-0000-0000-0000-000000000000',
                            planIdBid: $(this).children().eq(8).text(),
                            actualPurchasedLong: 0,
                            actualPurchasedBid: parseFloat($(this).children().eq(10).children('span[class=ipt_undistributed]').attr('data-bid')),
                            sellerSubjectId: $(this).children().eq(11).text(),
                            deviationRate: 0,
                            userMargin: 0,
                            sellerMargin: 0,
                            usedAmount: 0
                        };
                        _the.sendData.distributeDataList.push(disData2);

                    } else {
                        cType = cType.substring(0, 1);
                        var disData = {
                            id: 0,
                            distributedLong: parseFloat($(this).children().eq(5).text()),
                            distributedBid: parseFloat($(this).children().eq(6).text()),
                            used: parseFloat($(this).children().eq(4).text()),
                            contractType: cType,
                            planIdLong: $(this).children().eq(7).text(),
                            planIdBid: $(this).children().eq(8).text(),
                            actualPurchasedLong: parseFloat($(this).children().eq(10).children('span[class=ipt_undistributed]').attr('data-long')),
                            actualPurchasedBid: parseFloat($(this).children().eq(10).children('span[class=ipt_undistributed]').attr('data-bid')),
                            sellerSubjectId: $(this).children().eq(11).text(),
                            deviationRate: 0,
                            userMargin: 0,
                            sellerMargin: 0,
                            usedAmount: 0
                        };
                        _the.sendData.distributeDataList.push(disData);
                    }


                });
                let totleUrl = `${environment.sellerContractApi}api/GDPowerDistribution/SaveDistributionInfo/`;
                let headers = new Headers({ 'Content-Type': 'application/json' });
                let options = new RequestOptions({ headers: headers });

                this.sub3 = _the.authService.AuthPost(totleUrl, _the.sendData)
                    .subscribe((res) => {
                        let result = res.json();
                        alert(result.msg);
                        console.log(result);
                    })
            }


        });

        $('#contract').change(function () {
            var grid = $('#grid').data('kendoGrid');
            grid.dataSource.filter('');
        });

        $('#iSearch').bind('click', function () {
            var grid = $('#grid').data('kendoGrid');
            grid.dataSource.filter('');
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
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe(); }
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe(); }
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe(); }
    }
}
