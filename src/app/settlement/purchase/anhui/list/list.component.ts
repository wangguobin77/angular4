import { Component, OnInit, ViewEncapsulation , OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../+common/services/auth.service';
import{ environment } from '../../../../../environments/environment';

declare var $: any;
declare var kendo: any;
declare var mul: any;
declare var div: any;
declare var add:any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'settlepurchaselist',
    templateUrl: './list.html',
    styleUrls: ['./list.scss']
})
export class ListComponent implements OnDestroy{
    sub1;sub2;sub3;sub4;sub5;sub6;
    constructor(private router: Router, private authService: AuthService) { }

    year=2017;

    ngOnInit() {
        let the = this;

        this.year = new Date().getFullYear();

        let win :any={};
        let api=environment.sellerSettlementApi+"api/";
        
        //年份选择
; (function () {
    win.tcId = 34; //$("#hdTc").val();
    win.tcName = "安徽交易中心";//$("#hdTc").prop("name");

    var _filter = {
        data: { year: new Date().getFullYear(), tcId: win.tcId },
        picker: function () {
            var _this = this;
            $("#datePicker").kendoDatePicker({
                // defines the start view
                start: "decade",
                // defines when the calendar should return date
                depth: "decade",
                // display month and year in the input
                format: "yyyy",
                max: new Date(),
                change: function () {
                    _this.data.year = this.value().getFullYear();
                    _this.search();
                }
            });
        },
        search: function () {
            var _this = this;
            the.sub1=the.authService.AuthGet(`${api}ahpurchasesettlement/getreport/${_this.data.year}`).subscribe((res)=> {
                let data = res.json();
                win.initChart(data);
                win.initGrid(data.data);
            });
        },
        init: function () {
            this.picker();
            this.search();
        }
    };

    win.refresh = function () {
        _filter.search();
    }

    _filter.init();

})();

//渲染图表及年度合计
; (function () {
    //图形生成
    var _chart = {
        data: { total: {}, data: {}},
        creatLeftChart: function () {
            var total = this.data.total;

            if (!total) total = {
                profitsYuan: 0,
                paidPriceYuan: 0,
                unPaidPriceYuan: 0
            };

            $("#spProfits").text(kendo.toString(total.profitsYuan, "n"));
            $("#spPaidPrice").text(kendo.toString(total.paidPriceYuan, "n"));
            $("#spUnPaidPrice").text(kendo.toString(total.unPaidPriceYuan, "n"));

            var unPaidRate = total.profitsYuan==0?0: kendo.toString(total.unPaidPriceYuan / total.profitsYuan * 100, "n");
            var paidRate = total.profitsYuan==0?0:kendo.toString(total.paidPriceYuan / total.profitsYuan * 100, "n");

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
                        category: "未结金额",
                        value: unPaidRate,
                        color: "#3399ff"
                    }, {
                        category: "已结金额",
                        value: paidRate,
                        color: "#99cc33"
                    }]
                }],
                tooltip: {
                    visible: true,
                    format: "{0}%"
                }
            });

        },
        creatRightChart: function () {
            var _this = this;
            $("#chartLine").kendoChart({
                dataSource: {
                    data: _this.data.data
                },
                legend: {
                    position: "top"
                },
                seriesDefaults: {
                    type: "line"
                },
                series: [
                    {
                        name: "收益",
                        field: "profitsYuan",
                        color: "#3e9ffa"
                    }
                ],
                valueAxis: {
                    line: {
                        visible: true
                    },
                    title: { text: "金额(元)", font: "12px sans-serif", position: "top", rotation: 0, margin: { top: -30, right: -70 } }
                },
                categoryAxis: {
                    //categories: _this.categories,
                    field: "month",
                    majorGridLines: {
                        visible: false
                    },
                    step: 4,
                    autoBaseUnitSteps: {
                        days: [3]
                    },
                    title: {
                        text: "月",
                        font: "12px sans-serif",
                        position: "right",
                        margin: {
                            top: -16
                        }
                    }
                },
                tooltip: {
                    visible: false
                }
            });
        },
        refresh: function () {
            win.chart.setOptions();
            win.chartT.setOptions();
        },
        resize: function () {
            var chart = $("#chart").data("kendoChart");
            $(window).resize(function () {
                chart.refresh();
            });
        },
        yearCount: function () {
            var total = this.data.total;
            var c = "—";

            if (!total) {
                $("#spOffp").text(c);
                $("#spProf").text(c);
                $("#spOffa").text(c);
                $("#spFact").text(c);

                $("#spPaid").text(c);
                $("#spPaid").removeClass("color-red");

                $("#btnDo").hide();
            }
            else {
                $("#spOffa").text(kendo.toString(total.offsetAmount, "n4"));
                $("#spProf").text(kendo.toString(total.profitsYuan, "n"));

                if (total.hasPaid) {
                    $("#spPaid").text("已结");
                    $("#spPaid").removeClass("color-red").addClass("color-exactGreen");
                }
                else {
                    $("#spPaid").text("未结");
                    $("#spPaid").removeClass("color-exactGreen").addClass("color-red");
                }

                if (total.offsetPriceYuan == null) {
                    $("#spOffp").text(c);
                    $("#spPaid").text(c);
                    $("#spPaid").removeClass("color-red color-exactGreen");
                }
                else {
                    $("#spOffp").text(kendo.toString(total.offsetPriceYuan, "n"));
                }

                if (total.factProfitsYuan == null)
                    $("#spFact").text(c);
                else
                    $("#spFact").text(kendo.toString(total.factProfitsYuan, "n"));

                $("#btnDo").show();

                //$("#spUnPaid").show();
                //$("#spPaid").hide();
            }
        },
        init: function () {
            this.creatLeftChart();
            this.creatRightChart();
            this.yearCount();
            this.resize();
        }
    }
    win.initChart = function (data) {
        if (data !== undefined) _chart.data = data;
        _chart.init();
    };
})();

//结算列表
; (function () {

    var _grid = {
        data: [],
        load: function () {
            $("#grid").empty();
            $("#grid").kendoGrid({
                dataSource: {
                    data: _grid.data
                },
                pageable: false,
                noRecords: true,
                messages: {
                    noRecords: "没有任何数据"
                },
                columns: [
                    {
                        field: "inputBox", title: "&ensp;",
                        template: function (item) {
                            if (item.unPaidPrice == 0) {
                                return "";
                            }
                            return '<input type="checkbox" class="k-checkbox" id="eq' + item.month + '"/><label class="k-checkbox-label select-it" for="eq' + item.month + '"></label>';
                        }
                    },
                    { field: "settleDateDisplay", title: "用电周期", width: "270px" },
                    {
                        field: "plans", title: "类型", width: "160px",
                        template: function (item) {
                            if (!item.plans) return "—";
                            var names = [];
                            $.each(item.plans, function (i, m) {
                                if (i == 0) {
                                    names.push('<p class="plan-list">' + m.name + '</p>');
                                }
                                else {
                                    names.push('<p class="line plan-list">' + m.name + '</p>');
                                }
                            });
                            return names.join("");
                        }
                    },
                    {
                        field: "plans", title: "实际采购电量<p>(万千瓦时)</p>",
                        template: function (item) {
                            if (!item.plans) return "—";
                            var arr = [];
                            $.each(item.plans, function (i, m) {
                                if (i == 0) {
                                    arr.push('<p class="line-h48">' + m.purchasedAmountDisplay + '</p>');
                                }
                                else {
                                    arr.push('<p class="line line-h48">' + m.purchasedAmountDisplay + '</p>');
                                }
                            });
                            return arr.join("");
                        }
                    },
                    {
                        field: "plans", title: "交易电量<p>(万千瓦时)</p>",
                        template: function (item) {
                            if (!item.plans) return "—";
                            var arr = [];
                            $.each(item.plans, function (i, m) {
                                if (i == 0) {
                                    arr.push('<p class="data-list">' + m.tradeAmountDisplay + '</p>');
                                }
                                else {
                                    arr.push('<p class="line data-list">' + m.tradeAmountDisplay + '</p>');
                                }
                            });
                            return arr.join("");
                        }
                    },
                    { field: "usedAmountDisplay", title: "实际用电量<p>(万千瓦时)</p>" },
                    { field: "profitsDisplay", title: "收益<p>(元)</p>" },
                    { field: "paidPriceDisplay", title: "已结金额<p>(元)</p>", template: '<span class="paidPrice">#: paidPriceDisplay #</span>' },
                    {
                        field: "unPaidPriceDisplay", title: "未结金额<p>(元)</p>",
                        template: '<span class="outstandingAmount">#: unPaidPriceDisplay #</span><span class="year" style="display:none">#: year #</span><span class="month" style="display:none">#: month #</span>'
                    },
                    {
                        field: "UnitsInStock", title: "操作", width: "140px",
                        template: function (item) {
                            if (!item.plans) return "—";
                            return '<span class="color-exactGreen size-16 cur-p clearing">结算</span><span class="color-exactBlue ma-l10  size-16 cur-p seeBill">查看票据</span>';
                        }
                    }
                ]
            });
        },
        init: function () {
            this.load();
        }
    };

    win.initGrid = function (data) {
        if (data !== undefined) _grid.data = data;
        _grid.init();
        win.initSettle();
        win.lookVouchers();
        win.batchSettle();
    };

})();

//月结算操作
; (function () {
    var _settle = {
        data: { open: [], opened: {voucherTypes:null}},
        open: function () {
            //结算弹窗
            var dialogContent = '<form id="ticketsForm"><div class="clearing-box">'
                + '<p>'
                + '<span class="color-9">交易中心：</span>'
                + '<span id="tcname">' + win.tcName+'</span>'
                + '</p>'
                + '<p>'
                + '<span class="color-9">时间：</span>'
                + '<span id="sysDate">2017年1月</span>'
                + '</p>'
                + '<p>'
                + '<span class="color-9">结算金额：</span>'
                + '<div class="compute-box">'
                + '<div><span id="unPaidPrice">15678.33</span><p>未结金额(元)</p></div>'
                + '<span> × </span>'
                + '<div >'
                + '<div class="unit-input-list number-unit"  style="width: 100px;" >'
                + '<input id="outstandingAmount" name="outstandingAmount" type="number" required validationMessage="请输入结算比例" value="100" min="0" max="100" maxlength="3" style="width: 100%;" />'
                + '<span class="unit r-20">%</span>'
                + '</div>'
                + '<p>结算比例(%)</p></div>'
                + '<span> = </span>'
                + '<div style="width:100px">'
                + '<input id="endAmount" name="endAmount" type="number" required validationMessage="请输入结算金额" value="30" style="width: 100%;" />'
                + '<p>结算金额(元)</p></div>'
                + '</div>'
                + '</p>'
                + '<p>'
                + '<span class="color-9">上传票据：</span>'
                + '<p>'
                + '<input type="radio" name="engine" id="engine1" class="k-radio" checked="checked">'
                + '<label class="k-radio-label voucher-radio-label" for="engine1">&ensp;有票据</label>'
                + '<input type="radio" name="engine" id="engine2" class="k-radio">'
                + '<label class="k-radio-label ma-l20 voucher-radio-label" for="engine2">&ensp;没有票据</label>'
                + '</p>'
                + '</p>'
                + '<div class="select-list" id="upBox">'
                + '<div class="demo-section k-content wide">'
                + '<div class="wrapper">'
                + '<div id="products"></div>'
                + '<div class="dropZoneElement">'
                + '</div>'
                + '</div>'
                + '</div>'
                + '<input name="files" id="files" type="file" />'
                + '</div>'
                + '</div></form>';

            var dialog = $("#endDialog");
            dialog.kendoDialog({
                width: "600px",
                //title: "",
                title: "<span class='size-14'>结算</span>",
                closable: true,
                modal: false,
                content: dialogContent,
                actions: [
                    { text: '关闭' },
                    { text: '确定', primary: true, action: _settle.add }
                ]
            });

            dialog.data("kendoDialog").close();

            return dialog;
        },
        add: function () {
            var endAmount = $("#endAmount").data("kendoNumericTextBox");
            var amount = kendo.parseFloat(endAmount.value());
            var opens = _settle.data.open;
            var vouchers = [];

            if (amount == 0) {
                alert("结算金额不能为0");
                return false;
            }

            if ($("#engine1").prop("checked")) {
                $("#products>div.product").each(function () {
                    var $item = $(this);
                    var vtype = $item.find("input.drop-down").data("kendoDropDownList");
                    vouchers.push({
                        ImgId: $item.find("img").prop("id"),
                        Type: vtype.value()
                    });
                });
            }

            var input = { SettleConditions: opens, Vouchers: vouchers, Amount: amount };

            the.sub2=the.authService.AuthPost(`${api}ahpurchasesettlement/addsettlement/`, input).subscribe((res)=> {
                alert("结算成功");
                win.refresh();
                $("#endDialog").data("kendoDialog").close();
            });
            return false;
        },
        upload: function () {
            $("#files").kendoUpload({
                async: {
                    saveUrl: `${environment.sellerContractApi}/api/Upload/Kendo_Image_Upload`,
                    //removeUrl: "remove",
                    autoUpload: true
                },
                validation: {
                    allowedExtensions: [".jpg", ".jpeg", ".png", ".bmp", ".gif"]
                },
                success: function (e) {
                    console.log(_settle.data.opened.voucherTypes);

                    if (e.operation == "upload") {
                        for (var i = 0; i < e.files.length; i++) {
                            var file = e.files[i].rawFile;
                            if (file) {
                                var reader = new FileReader();
                                var fileId = e.response[i];

                                reader.onloadend = function () {
                                    $("<div class='product'><img src=" + this.result + " id=" + fileId + " /><i class='iconfont icon-guanbipsd del'></i><div><input type='text' class='drop-down' style='width: 110px;'></div></div>").appendTo($("#products"));
                                    $("input.drop-down").kendoDropDownList({
                                        dataTextField: "name",
                                        dataValueField: "code",
                                        dataSource: _settle.data.opened.voucherTypes,
                                        index: 0
                                    });
                                };

                                reader.readAsDataURL(file);
                            }
                        }
                    }
                },
                showFileList: false,
                dropZone: ".dropZoneElement"
            });
            $(document).on("click", "i.del", function () {
                $(this).closest(".product").remove();
            });
        },
        load: function () {
            var dialog = _settle.open();
            $("#outstandingAmount").kendoNumericTextBox({
                decimals: 2,
                format: "#.##"
            });
            $("#endAmount").kendoNumericTextBox({
                decimals: 2,
                format: "#.##"
            });
            var endAmount = $("#endAmount").data("kendoNumericTextBox");
            var ratio = $("#outstandingAmount").data("kendoNumericTextBox");
            $(document).on("blur", "#outstandingAmount", function () {
                endAmount.value(mul(kendo.parseFloat($("#unPaidPrice").text()), ratio.value() / 100));
            });
            $(document).on("blur", "#endAmount", function () {
                ratio.value(div(endAmount.value(), kendo.parseFloat($("#unPaidPrice").text())) * 100);
            });
            $(document).on("click", ".voucher-radio-label", function () {
                setTimeout(function () {
                    if ($("#engine2").prop("checked")) {
                        $("#upBox").hide();
                    } else {
                        $("#upBox").show();
                    }
                }, 100)
            });

            the.sub3=the.authService.AuthPost(`${api}ahpurchasesettlement/opensettlement/`, _settle.data.open).subscribe((res)=> {
                let data = res.json();
                _settle.data.opened = data;
                var unPaid = kendo.toString(data.unPaidPrice, "n");

                $("#tcname").html(data.tCName);
                $("#sysDate").html(data.sysDate);
                $("#unPaidPrice").html(unPaid);
                $("#outstandingAmount").val("100");

                if (data.unPaidPrice > 0) {
                    endAmount.max(data.unPaidPrice);
                }
                else {
                    endAmount.max(0);
                    endAmount.min(data.unPaidPrice);
                }
                
                endAmount.value(data.unPaidPrice);

                _settle.upload();
                dialog.data("kendoDialog").open();
            });
        },
        bind: function () {
            $(".clearing").off().on("click", function () {
                _settle.data.open = [];

                var $tr = $(this).closest("tr");

                var item = {
                    TCId: win.tcId,
                    TCName: win.tcName,
                    Year: $tr.find("td>span.year").text(),
                    Month: $tr.find("td>span.month").text(),
                    UnPaidPrice: kendo.parseFloat($tr.find("td>span.outstandingAmount").text()),
                    PaidPrice: kendo.parseFloat($tr.find("td>span.paidPrice").text())
                };

                if (item.UnPaidPrice == 0) {
                    alert("无未结金额进行结算");
                    return false;
                }

                _settle.data.open.push(item);

                _settle.load();
            });
        },
        init: function () {
            this.bind();
        }
    };

    win.initSettle = function () {
        _settle.init();
    };

})();

//查看年度票据与月票据
; (function () {
    var _settle = {
        data: { open: {} },
        dialog: function () {
            var dialog = $("#searchDialog");

            dialog.kendoDialog({
                width: "800px",
                title: "<span class='size-14'>查看票据</span>",
                closable: true,
                modal: false,
                content: '<div class="powerGridEnd dia-content" id="divVouchers"></div>',
                actions: [
                    { text: '关闭' }
                ]
            });

            dialog.data("kendoDialog").close();

            return dialog;
        },
        load: function () {
            var dialog = _settle.dialog();

            the.sub4=the.authService.AuthGet(`${api}ahpurchasesettlement/lookvouchers/`, _settle.data.open).subscribe((res)=> {
                let data = res.json();

                $.each(data, function (i, item) {
                    var arr = [];
                    $.each(item.scans, function (j, src) {
                        arr.push('<div class="img-box" data-index="' + j + '">'
                            + '<img src="' + environment.uploadRoot + src + '" alt="">'
                            + '<i class="iconfont icon-sousuo"></i>'
                            + '</div>');
                    });

                    $("#divVouchers").append('<div class="dia-content-list ma-t10">'
                        + '<div class="dia-c-top">'
                        + '<span class="color-9">操作人：</span><span>' + item.fullName + '</span>'
                        + '<div class="float-r ma-r20">'
                        + '<span class="color-9">时间：</span>'
                        + '<span>' + item.createDateDisplay + '</span>'
                        + '</div>'
                        + '</div>'
                        + '<div class="dia-c-l">'
                        + '<p>' + kendo.toString(item.amountM, "n") + '</p>'
                        + '<span>金额(元)</span>'
                        + '</div>'
                        + '<div class="dia-c-r" style="min-height:60px">'
                        + '<div class="contract-img bigImg">'
                        + arr.join("")
                        + '</div>'
                        + '</div>');
                });

                dialog.data("kendoDialog").open();
            });
        },
        bind: function () {
            //月票据
            $(".seeBill").off().on("click", function () {
                var $tr = $(this).closest("tr");
                var item = {
                    tcId: win.tcId,
                    year: $tr.find("td>span.year").text(),
                    month: $tr.find("td>span.month").text()
                };
                _settle.data.open = item;
                _settle.load();
            });
            //年票据
            $("#lookV").off().on("click", function () {
                var offp = $("#spOffp").text();

                if (offp == "—") {
                    alert("不能查看当年的年度票据");
                    return false;
                }
                var item = {
                    tcId: win.tcId,
                    year: $("#datePicker").val(),
                    month: 0
                };
                _settle.data.open = item;
                _settle.load();

                return false;
            });
        },
        init: function () {
            this.bind();
        }
    };

    win.lookVouchers = function () {
        _settle.init();
    };

})();

//合并清算与年度结算
; (function () {

    //复选框选择
    var verifySelectAll = {
        init: function () {
            this.bindEvent();
        },
        bindEvent: function () {
            var self = this;
            $(document).on("click", ".select-it", function () {
                var _this = this;
                setTimeout(function () {
                    var $input = $(_this).parents("tbody").find("input[type=checkbox]");
                    self.verifyIt($input, _this);
                }, 100);
            })
            $(document).on("click", "#selectAll", function () {
                var _this = this;
                setTimeout(function () {
                    var $input = $("#grid").find("input[type=checkbox]");
                    if ($("#eq0").prop("checked")) {
                        $input.prop("checked", true);
                        $("#selectedCount").text($input.length);
                        var k = 0;
                        for (var i = 0; i < $input.length; i++) {
                            k = add(k, kendo.parseFloat($input.eq(i).parents("tr").find(".outstandingAmount").text()));
                        }
                        $("#totleAmount").text(k);
                    } else {
                        $input.prop("checked", false);
                        $("#selectedCount").text(0);
                        $("#totleAmount").text(0);
                    }
                }, 100);
            })
        },
        verifyIt: function (allInput, self) {
            var m = 0;
            var k = 0;
            for (var i = 0; i < allInput.length; i++) {
                if ($(allInput[i]).prop("checked")) {
                    m++;
                    k += kendo.parseFloat($(allInput[i]).parents("tr").find(".outstandingAmount").text());
                }
            }
            $("#selectedCount").text(m);
            $("#totleAmount").text(k);
            if (m <= (allInput.length - 1)) {
                $("#eq0").prop("checked", false);
            } else {
                $("#eq0").prop("checked", true);
            }
        }
    }
    verifySelectAll.init();

    var flag = true;

    $(document).on("click", "#clearing", function () {
        $("#grid").addClass("active");
        $("#dataBox").show();
        $("#totleBox").hide();
        $("#yearTotle").text("年度合计");
        flag = true;
    });
    $(document).on("click", "#yearTotle", function () {
        $("#totleBox").slideToggle(10);
        if (flag) {
            $(this).text("收起");
            $("#dataBox").hide();
        } else {
            $(this).text("年度合计");
        }
        flag = !flag
    });
    $(document).on("click", "#cancel", function () {
        $("#grid").removeClass("active");
        $("#dataBox").hide();
    });

    var _settle = {
        data: { open: [], opened: {voucherTypes:null} },
        dialog: function () {
            //结算弹窗
            var dialogContent = '<form id="ticketsForm"><div class="clearing-box">'
                + '<p>'
                + '<span class="color-9">交易中心：</span>'
                + '<span id="tcname">' + win.tcName+'</span>'
                + '</p>'
                + '<p>'
                + '<span class="color-9">时间：</span>'
                + '<span id="sysDate">2017年1月</span>'
                + '</p>'
                + '<p>'
                + '<span class="color-9">结算金额：</span>'
                + '<div class="compute-box">'
                + '<div><span id="unPaidPrice">15678.33</span><p>未结金额(元)</p></div>'
                + '<span> × </span>'
                + '<div >'
                + '<div class="unit-input-list number-unit"  style="width: 100px;" >'
                + '<input id="outstandingAmount" name="outstandingAmount" type="number" required validationMessage="请输入结算比例" value="100" min="0" max="100" maxlength="3" style="width: 100%;" />'
                + '<span class="unit r-20">%</span>'
                + '</div>'
                + '<p>结算比例(%)</p></div>'
                + '<span> = </span>'
                + '<div style="width:100px">'
                + '<input id="endAmount" name="endAmount" type="number" required validationMessage="请输入结算金额" value="30" style="width: 100%;" />'
                + '<p>结算金额(元)</p></div>'
                + '</div>'
                + '</p>'
                + '<p>'
                + '<span class="color-9">上传票据：</span>'
                + '<p>'
                + '<input type="radio" name="engine" id="engine1" class="k-radio" checked="checked">'
                + '<label class="k-radio-label voucher-radio-label" for="engine1">&ensp;有票据</label>'
                + '<input type="radio" name="engine" id="engine2" class="k-radio">'
                + '<label class="k-radio-label ma-l20 voucher-radio-label" for="engine2">&ensp;没有票据</label>'
                + '</p>'
                + '</p>'
                + '<div class="select-list" id="upBox">'
                + '<div class="demo-section k-content wide">'
                + '<div class="wrapper">'
                + '<div id="products"></div>'
                + '<div class="dropZoneElement">'
                + '</div>'
                + '</div>'
                + '</div>'
                + '<input name="files" id="files" type="file" />'
                + '</div>'
                + '</div></form>';

            var dialog = $("#endDialog");
            dialog.kendoDialog({
                width: "600px",
                //title: "",
                title: "<span class='size-14'>结算</span>",
                closable: true,
                modal: false,
                content: dialogContent,
                actions: [
                    { text: '关闭' },
                    { text: '确定', primary: true, action: _settle.add }
                ]
            });

            dialog.data("kendoDialog").close();

            return dialog;
        },
        add: function () {
            var endAmount = $("#endAmount").data("kendoNumericTextBox");
            var amount = kendo.parseFloat(endAmount.value());
            var opens = _settle.data.open;
            var vouchers = [];

            if (amount == 0) {
                alert("结算金额不能为0");
                return false;
            }

            if ($("#engine1").prop("checked")) {
                $("#products>div.product").each(function () {
                    var $item = $(this);
                    var vtype = $item.find("input.drop-down").data("kendoDropDownList");
                    vouchers.push({
                        ImgId: $item.find("img").prop("id"),
                        Type: vtype.value()
                    });
                });
            }

            var input = { SettleConditions: opens, Vouchers: vouchers, Amount: amount };

            the.sub5=the.authService.AuthPost(`${api}ahpurchasesettlement/addsettlement/`, input).subscribe((res)=> {
                alert("结算成功");
                win.refresh();
                $("#endDialog").data("kendoDialog").close();
            });
            return false;
        },
        upload: function () {
            $("#files").kendoUpload({
                async: {
                    saveUrl: `${environment.sellerContractApi}/api/Upload/Kendo_Image_Upload`,
                    //removeUrl: "remove",
                    autoUpload: true
                },
                validation: {
                    allowedExtensions: [".jpg", ".jpeg", ".png", ".bmp", ".gif"]
                },
                success: function (e) {
                    console.log(_settle.data.opened.voucherTypes);

                    if (e.operation == "upload") {
                        for (var i = 0; i < e.files.length; i++) {
                            var file = e.files[i].rawFile;
                            if (file) {
                                var reader = new FileReader();
                                var fileId = e.response[i];

                                reader.onloadend = function () {
                                    $("<div class='product'><img src=" + this.result + " id=" + fileId + " /><i class='iconfont icon-guanbipsd del'></i><div><input type='text' class='drop-down' style='width: 110px;'></div></div>").appendTo($("#products"));
                                    $("input.drop-down").kendoDropDownList({
                                        dataTextField: "name",
                                        dataValueField: "code",
                                        dataSource: _settle.data.opened.voucherTypes,
                                        index: 0
                                    });
                                };

                                reader.readAsDataURL(file);
                            }
                        }
                    }
                },
                showFileList: false,
                dropZone: ".dropZoneElement"
            });
            $(document).on("click", "i.del", function () {
                $(this).closest(".product").remove();
            });
        },
        load: function () {
            var dialog = _settle.dialog();
            $("#outstandingAmount").kendoNumericTextBox({
                decimals: 2,
                format: "#.##"
            });
            $("#endAmount").kendoNumericTextBox({
                decimals: 2,
                format: "#.##"
            });
            var endAmount = $("#endAmount").data("kendoNumericTextBox");
            var ratio = $("#outstandingAmount").data("kendoNumericTextBox");
            $(document).on("blur", "#outstandingAmount", function () {
                endAmount.value(mul(kendo.parseFloat($("#unPaidPrice").text()), ratio.value() / 100));
            });
            $(document).on("blur", "#endAmount", function () {
                ratio.value(div(endAmount.value(), kendo.parseFloat($("#unPaidPrice").text())) * 100);
            });
            $(document).on("click", ".voucher-radio-label", function () {
                setTimeout(function () {
                    if ($("#engine2").prop("checked")) {
                        $("#upBox").hide();
                    } else {
                        $("#upBox").show();
                    }
                }, 100)
            });

            endAmount.readonly();
            ratio.readonly();

            the.sub6=the.authService.AuthPost(`${api}ahpurchasesettlement/opensettlement/`, _settle.data.open).subscribe((res)=> {
                let data = res.json();
                _settle.data.opened = data;
                var unPaid = kendo.toString(data.unPaidPrice, "n");

                $("#tcname").html(data.tCName);
                $("#sysDate").html(data.sysDate);
                $("#unPaidPrice").html(unPaid);
                $("#outstandingAmount").val("100");

                endAmount.max(unPaid);
                endAmount.value(unPaid);

                _settle.upload();
                dialog.data("kendoDialog").open();
            });
        },
        bind: function () {
            $("#submit").off().on("click", function () {
                _settle.data.open = [];

                $("#grid").find("input.k-checkbox:checked").each(function () {
                    var $tr = $(this).closest("tr");

                    var item = {
                        TCId: win.tcId,
                        TCName: win.tcName,
                        Year: $tr.find("td>span.year").text(),
                        Month: $tr.find("td>span.month").text(),
                        UnPaidPrice: kendo.parseFloat($tr.find("td>span.outstandingAmount").text()),
                        PaidPrice: kendo.parseFloat($tr.find("td>span.paidPrice").text())
                    };

                    _settle.data.open.push(item);
                });

                if (kendo.parseFloat($("#totleAmount").text()) == 0) {
                    alert("无未结金额进行结算");
                    return false;
                }

                _settle.load();

                return false;
            });

            //年度偏差结算
            $("#addV").off().on("click", function () {

                var offp = $("#spOffp").text();

                if (offp == "—") {
                    alert("不能结算本年的偏差金额");
                    return false;
                }
                if ($("#spPaid").text() == "已结") {
                    alert("本年的偏差金额已经结算");
                    return false;
                }

                var item = {
                    TCId: win.tcId,
                    TCName: win.tcName,
                    Year: $("#datePicker").val(),
                    Month: 0,
                    UnPaidPrice: kendo.parseFloat(offp)
                };

                if (item.UnPaidPrice == 0) {
                    alert("无未结金额进行结算");
                    return false;
                }

                _settle.data.open = [];
                _settle.data.open.push(item);

                _settle.load();

                return false;
            });
        },
        init: function () {
            this.bind();
        }
    };

    win.batchSettle = function () {
        _settle.init();
    };

})();

    }
ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
		if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe();}
        if (this.sub4 !== undefined && this.sub4 !== null) { this.sub4.unsubscribe();}
        if (this.sub5 !== undefined && this.sub5 !== null) { this.sub5.unsubscribe();}
        if (this.sub6 !== undefined && this.sub6 !== null) { this.sub6.unsubscribe();}
    }
}