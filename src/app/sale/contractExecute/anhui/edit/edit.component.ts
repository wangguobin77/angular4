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
          operatorId:  '',
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

        var contractDate = [
            { text: "全部售电合约", value: "" },
            { text: "长协", value: "1," },
            { text: "竞价", value: "2," },
            { text: "长协,竞价", value: "1,2" }
        ];

        $("#contract").kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: contractDate,
            optionLabel: "--全部售电合约--"
        });


        this.sub1 = _the.authService.AuthGet(`${environment.sellerContractApi}api/AHPowerDistribution/AHDistributionDetails/${id}`, ).subscribe(function (res) {
            _the.contractInfo = res.json();
            var undisLong = _the.contractInfo.actualPurchaseAmountLongFixed - _the.contractInfo.distributedAmountLongFixed;
            var undisBid = _the.contractInfo.actualPurchaseAmountBidFixed - _the.contractInfo.distributedAmountBidFixed;
            _the.contractInfo.undisLong = (undisLong > 0 ? undisLong : 0);
            _the.contractInfo.undisBid = (undisBid > 0 ? undisBid : 0);
            if (_the.contractInfo != null) {
                loaddata();
            }
        });
        function loaddata() {
            var filter = {
                advance: function () {
                    var filters4 = [];
                    var ctype = $("#contract").data("kendoDropDownList").value();
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
                            var paras = new RequestOptions();
                            paras.params = f.data;
                            this.sub2 = _the.authService.AuthGet(`${environment.sellerContractApi}api/AHPowerDistribution/AHGetContractPlans/${year}/${month}`, f.data).subscribe(function (res) {
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
                dataBound: RecalcSumLongAndBid,
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
                    { field: "LongPurchasedAmountFixed", title: "长协交易电量<br/>（万千瓦时）" },
                    { field: "BidPurchasedAmountFixed", title: "竞价交易电量<br/>（万千瓦时）" },
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
                            var str = "<span style='cursor:pointer'  data-long='" + dataItem.LongActualPurchaseAmountFixed + "' data-bid='" + dataItem.BidActualPurchaseAmountFixed + "' type='text' class='ipt_undistributed'   ContractId='" + dataItem.SubUserId + "' LongPId ='" + dataItem.LongPurchasePlanId + "'  BidPId ='" + dataItem.BidPurchasePlanId + "'  LongAmountFix ='" + dataItem.LongAmountFixed + "'  BidAmountFix ='" + dataItem.BidAmountFixed + "'>分配电量</span>";
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
                    $('#dialogContent').text('该合约数据有误，无法为其分配电量！');
                    $('#dialogSubmit').data('kendoDialog').open();
                    return false;
                }
                //保存ID

                RecalcSumLongAndBid();
                let $this = $(this);
                let $domThis = $(this);
                $('#popLong').html($this.attr('longamountfix'));
                $('#popBId').html($this.attr('bidamountfix'));
                var did = $this.attr('longpid');
                var bid = $this.attr('bidpid');
                var longRemain = 0;
                if (did != '00000000-0000-0000-0000-000000000000') longRemain = add(longRemain, parseFloat($('p span[data-type=long][data-id=\'' + did.toLocaleLowerCase() + '\']').data('num')));
                var bidRemain = 0;
                if (bid != '00000000-0000-0000-0000-000000000000') bidRemain = add(bidRemain, parseFloat($('i[class=undBidAmount]').data('num')));
                $('#pop').html(add(longRemain, bidRemain));
                $('#parDataId').val($this.parent().parent().attr('data-uid'));
                $('#usedEnergyAmountBox').data('kendoNumericTextBox').value($this.parent().siblings().eq(4).text());
                $('#purchasedEnergyAmountBox').data('kendoNumericTextBox').value(parseFloat($this.parent().siblings().eq(5).text()) + parseFloat($this.parent().siblings().eq(6).text()));
                $('#dialog').data('kendoDialog').open();

                //var $sel = $("span.k-numeric-wrap").find("span.k-select");

            });

            function onOK() {

                $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(4).text($('#usedEnergyAmountBox').val());
                var did = $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('longpid');
                var bid = $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('bidpid');

                // var cType = ($("tr[data-uid ='" + $("#parDataId").val() + "']").children().eq(1).text() === "长协" ? 1 : ($("tr[data-uid ='" + $("#parDataId").val() + "']").children().eq(1).text() === "竞价" ? 2 : 3));
                var cType = $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(12).text();
                //BUG 1331
                var inputU = 0;
                inputU = add(inputU, parseFloat($('#usedEnergyAmountBox').val()));

                var longRemain = 0;
                var longSubSum = 0;
                if (did != '00000000-0000-0000-0000-000000000000') {
                    $.each($('span[data-type=longU]'), function (i, v) {
                        if (($(this).data('id')).toLocaleLowerCase() === did.toLocaleLowerCase()) {
                            longSubSum = add(longSubSum, parseFloat($(this).data('num')));
                        }
                    });
                }

                longRemain = add(longRemain, parseFloat($("span[data-type=longU]").filter("[data-id='" + did.toLocaleLowerCase() + "']").data("num")));
                if (isNaN(longRemain)) {
                    longRemain = 0;
                }
                var bidRemain = 0;
                bidRemain = add(bidRemain, parseFloat($('i[class=undBidAmount]').data('num')));
                if (isNaN(bidRemain)) {
                    bidRemain = 0;
                }
                var inputD = 0;
                inputD = add(inputD, parseFloat($('#purchasedEnergyAmountBox').val()));
                var longP = 0;
                longP = add(longP, parseFloat($('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(2).text()));

                if (inputU < inputD) {
                    $('#dialogContent').text('分配的交易总电量不能大于实用总电量！');
                    $('#dialogSubmit').data('kendoDialog').open();
                    return;
                }
                //长协，竞价，长协+竞价，长协，竞价

                if (cType == '1,' && did !== '00000000-0000-0000-0000-000000000000') {
                    //获取原来的值
                    longRemain=add(longRemain,parseFloat($('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(5).text()));
                    $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(5).text(inputD);
                    $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('longamountfix', inputD);
                    if (longRemain >= inputD) {
                        $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('data-long', inputD);
                        $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('data-bid', 0);
                    }
                    else {
                        $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('data-long', longRemain);
                        $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('data-bid', sub(inputD, longRemain));
                    }
                    RecalcSumLongAndBid();
                    $('#dialog').data('kendoDialog').close();
                }
                if ((cType == '2,' && bid !== '00000000-0000-0000-0000-000000000000') || (cType == '3,' && did == '00000000-0000-0000-0000-000000000000' && bid !== '00000000-0000-0000-0000-000000000000')) {
                    $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(6).text(inputD);
                    $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('bidamountfix', inputD);
                    $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('data-bid', inputD);
                    RecalcSumLongAndBid();
                    $('#dialog').data('kendoDialog').close();
                }

                if (cType == '1,2,' && did !== '00000000-0000-0000-0000-000000000000') {
                    if (longP >= inputD) {
                        $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(5).text(inputD);
                        $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(6).text(0);
                        $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('longamountfix', inputD);
                        $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('bidamountfix', 0);

                    } else {
                        $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(5).text(longP);
                        $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(6).text(sub(inputD, longP));
                        $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('longamountfix', longP);
                        $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('bidamountfix', sub(inputD, longP));
                    }
                    var longBefore = 0;
                    longBefore = parseFloat($('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').data('long'));
                    var bidBefore = 0;
                    bidBefore = parseFloat($('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').data('bid'));


                    var longSum = 0;
                    if (did != '00000000-0000-0000-0000-000000000000') {
                        $.each($('span[data-type=longU]'), function (i, v) {
                            if (($(this).data('id')).toLocaleLowerCase() === did.toLocaleLowerCase()) {
                                longSum = add(longSum, parseFloat($(this).data('num')));
                            }
                        });
                    }
                    //长协，竞价的分配规则：先扣完长协包，扣完长协包，扣竞价

                    var longleft = 0
                    //长协包总未分配量
                    longleft = add(longleft, parseFloat($("span[data-type=longU]").filter("[data-id='" + did.toLocaleLowerCase() + "']").data("num")));
                    longleft = add(longleft, longBefore);
                    //判断剩余的电量是否比输入的大
                    if (longleft >= inputD) {
                        $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('data-long', inputD);
                        $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('data-bid', 0);
                    }
                    else {
                        //如果剩余的电量比输入的小，则扣完长协扣竞价   计算实际在竞价分配了多少，（实际用电量=包剩余+申报）

                        $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('data-long', longleft);
                        $('tr[data-uid =\'' + $('#parDataId').val() + '\']').children().eq(10).children('span').attr('data-bid', sub(inputD, longleft));
                    }
                    RecalcSumLongAndBid();
                    $('#dialog').data('kendoDialog').close();
                }

            }

            function RecalcSumLongAndBid() {

                //var sumLong = parseFloat($("#needTobeDistriAmountLong").text());
                var sumLong = 0;
                sumLong = add(sumLong, parseFloat($('#needTobeDistriAmountLong').text()));
                var sumLongD = 0;

                //遍历已分配的长协包
                $.each($('span[data-type=longD]'), function (i, val) {
                    var longId = $(this).data('id');//当前遍历到的已分配的长协包的ID
                    var longSubSum = 0;
                    //遍历长协已分配的电量（存放在分配按钮中）
                    $.each($('span[class=ipt_undistributed]'), function (i, val) {
                        if (($(this).attr('longpid')).toLocaleLowerCase() === longId.toLocaleLowerCase()) {
                            longSubSum = add(longSubSum, parseFloat($(this).attr('data-long')));
                        }
                    });
                    $(this).data('num', longSubSum);
                    $(this).siblings('i').text(longSubSum + '万千瓦时');
                    //长协包可分配总电量
                    var subSumLong = parseFloat($('span[data-type=long]').filter('[data-id=\'' + longId + '\']').data('num'));
                    var subSD = 0;
                    //可分配总电量-已分配=可分配
                    subSD = sub(subSumLong, longSubSum);
                    $('span[data-type=longU]').filter('[data-id=\'' + longId + '\']').data('num', subSD);
                    $('span[data-type=longU]').filter('[data-id=\'' + longId + '\']').siblings('i').text(subSD + '万千瓦时');
                    sumLongD = add(sumLongD, longSubSum);
                });

                var sssssss = 0;
                sssssss = sub(sumLong, sumLongD);
                $('#dLongAmount').html('已分配电量: ' + sumLongD + '万千瓦时');

                $('#undLongAmount').html('未分配电量: ' + sssssss + '万千瓦时');
                var sumBid = 0;
                //竞价未分配总电量
                sumBid = add(sumBid, parseFloat($('#needTobeDistriAmountBid').text()));
                var sumBidD = 0;
                //计算竞价总电量
                $.each($('span[class=ipt_undistributed]'), function (i, val) {
                    sumBidD = add(sumBidD, parseFloat($(this).attr('data-bid')));
                });
                var sumBD = 0;
                sumBD = sub(sumBid, sumBidD);
                $('i[class=dBidAmount]').data('num', sumBidD);
                $('i[class=dBidAmount]').text(sumBidD);
                $('i[class=undBidAmount]').data('num', sumBD);
                $('i[class=undBidAmount]').text(sumBD);
            }

            var str = `<ul class="pd-20 dialog-c">
             <li>
             <p class="required">长协预售电量：<span id="popLong"></span> 万千瓦时</p>
             <p class="required">竞价预售电量：<span id="popBId"></span> 万千瓦时</p>
             <p class="required">可分配交易电量：<span id="pop">(${_the.contractInfo.undisLong}+${_the.contractInfo.undisBid} )</span> 万千瓦时</p>
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

            $('#submitDistribution').click(function () {

                var undis = parseFloat($(".undBidAmount").text());
                if (undis < 0) {
                    alert("已超出未分配电量最小值0，请核对");
                    return false;
                } else {
                    _the.sendData.distributeDataList = [];
                    var needTobeDistriAmountLong = parseFloat($('#needTobeDistriAmountLong').text());
                    var needTobeDistriAmountBid = parseFloat($('#needTobeDistriAmountBid').text());

                    $.each($('tbody tr'), function (i, val) {
                        var cType = $(this).children().eq(12).text();
                        if (cType == '1,2,') {
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
                                sellerSubjectId: parseFloat($(this).children().eq(11).text()),
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
                                contractType: parseFloat(cType),
                                planIdLong: $(this).children().eq(7).text(),
                                planIdBid: $(this).children().eq(8).text(),
                                actualPurchasedLong:parseFloat($(this).children().eq(10).children('span[class=ipt_undistributed]').attr('data-long')),
                                actualPurchasedBid: parseFloat($(this).children().eq(10).children('span[class=ipt_undistributed]').attr('data-bid')),
                                sellerSubjectId: parseFloat($(this).children().eq(11).text()),
                                deviationRate: 0,
                                userMargin: 0,
                                sellerMargin: 0,
                                usedAmount: 0
                            };
                            _the.sendData.distributeDataList.push(disData);
                        }
                    });
                    let totleUrl = `${environment.sellerContractApi}api/AHPowerDistribution/AHDistributeAll/`;
                    let headers = new Headers({ 'Content-Type': 'application/json' });
                    let options = new RequestOptions({ headers: headers });

                    _the.sub3 = _the.authService.AuthPost(totleUrl, _the.sendData)
                        .subscribe((res) => {
                            let result = res.json();
                            alert(result.msg)
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
    }

    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe(); }
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe(); }
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe(); }
    }
}

