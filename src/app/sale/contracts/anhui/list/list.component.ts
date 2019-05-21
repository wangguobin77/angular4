import { Component, OnInit, ViewEncapsulation,OnDestroy } from '@angular/core';
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
import { ListService } from './list.service';
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
export class ListComponent implements OnDestroy {

    subscribes:Array<any>=[];

    // 设置申报期限
    setDay = {
        days: [],
        defaultDay: '28',
        opened: false,
        form: new FormGroup({
            day: new FormControl()
        }),
        close: () => {
            this.setDay.opened = false;
        },
        submit: (e) => {
            e.preventDefault();

            let the = this;
            let day = this.setDay.form.value['day'];

            let su$ = this.authService.AuthPost(`${environment.sellerContractApi}api/Common/SetReportingPeriod/${day}`, null).subscribe(function (msg) {
                let res = msg.json();
                if (res.result) {
                    alert('设置成功！');
                    the.setDay.close();
                }
                else {
                    alert(res.msg);
                    the.setDay.close();
                }
            });

            this.subscribes.push(su$);
        },
        init: () => {
            this.setDay.days = [
                { text: '1', value: '1' },
                { text: '2', value: '2' },
                { text: '3', value: '3' },
                { text: '4', value: '4' },
                { text: '5', value: '5' },
                { text: '6', value: '6' },
                { text: '7', value: '7' },
                { text: '8', value: '8' },
                { text: '9', value: '9' },
                { text: '10', value: '10' },
                { text: '11', value: '11' },
                { text: '12', value: '12' },
                { text: '13', value: '13' },
                { text: '14', value: '14' },
                { text: '15', value: '15' },
                { text: '16', value: '16' },
                { text: '17', value: '17' },
                { text: '18', value: '18' },
                { text: '19', value: '19' },
                { text: '20', value: '20' },
                { text: '21', value: '21' },
                { text: '22', value: '22' },
                { text: '23', value: '23' },
                { text: '24', value: '24' },
                { text: '25', value: '25' },
                { text: '26', value: '26' },
                { text: '27', value: '27' },
                { text: '28', value: '28' },
            ];
        }
    };

    constructor(private router: Router, private authService: AuthService, private http: Http) {
        this.setDay.init();
    }

    ngOnInit() {

        let the = this;

        // 构建kendoGrid的过滤器
        let filter = {
            mode: 'fast',
            fast: function () {
                let v = $('#txtKey').val();
                if (v !== '') {
                    return `(SubjectName~contains~'${v}'~or~ContractName~contains~'${v}')`;
                }
                return '';
            },
            advance: function () {
                // (ContractType~eq~1~or~ContractType~eq~2)~and~(Status~eq~0~or~Status~eq~2)~and~UsedPowerType~eq~2
                let filters1 = [];
                let filters2 = [];
                if ($('#eq1').is(':checked'))
                    filters1.push('ContractType~eq~1');
                if ($('#eq2').is(':checked'))
                    filters1.push('ContractType~eq~2');
                // if ($('#eq3').is(':checked'))
                //     filters1.push('ContractType~eq~3');

                if ($('#eq4').is(':checked'))
                    filters2.push('Status~eq~1');   
                if ($('#eq5').is(':checked'))
                    filters2.push('Status~eq~1');
                if ($('#eq6').is(':checked'))
                    filters2.push('Status~eq~0');
                if ($('#eq7').is(':checked'))
                    filters2.push('Status~eq~2');

                let filters3 = [];
                if ($('#eq4').is(':checked') && (!$('#eq5').is(':checked'))) {
                    filters3.push(`EndDate~gt~'${kendo.toString(new Date(), 'yyyy-MM-dd HH:mm')}'`);
                    filters3.push(`EndDate2~lt~'${kendo.toString(new Date(), 'yyyy-MM-dd HH:mm')}'`);
                }

                let filters4 = [];
                if ($('#electricityTypeSelect').val() !== '') {
                    filters4.push(`UsedPowerType~eq~${$('#electricityTypeSelect').val() * 1}`);
                }

                let filters = [];

                if (filters1.length !== 0) {
                    filters.push(`(${filters1.join('~or~')})`);
                }
                if (filters2.length !== 0) {
                    filters.push(`(${filters2.join('~or~')})`);
                }
                if (filters3.length !== 0) {
                    filters.push(filters3.join('~and~'));
                }
                if (filters4.length !== 0) {
                    filters.push(filters4.join('~and~'));
                }

                return filters.join('~and~');
            },
            get: function () {
                if (filter.mode === 'fast') return filter.fast();
                return filter.advance();
            }
        };

        $('#gridContracts').kendoGrid({
            dataSource: {
                transport: {
                    read: function (f) {
                        f.data.filter = filter.get();
                        the.subscribes.push(the.authService.AuthGet(`${environment.sellerContractApi}api/AHContract`, f.data).subscribe(function (res) {
                            f.success(res.json());
                        }));
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
            filterable: {
                extra: false
            },
            pageable: {
                pageSizes: true,
                buttonCount: 5,
                pageSize: 5
                // change: function () {
                //    resizeFunction();
                // }
            },
            noRecords: true,
            messages: {
                noRecords: '当前没有任何数据'
            },
            columns: [
                {
                    field: 'Id', title: '订单内容', width: '450px',
                    template: function (item) {
                        let statusDisplay = '';
                        if (item.Status === 1) {
                            if (item.Expiring) {
                                statusDisplay = '<div class="state"><span class="color-red">即将到期</span></div>';
                            }
                            else {
                                statusDisplay = '<div class="state"><span class="color-blue">正执行</span></div>';
                            }
                        } else if (item.Status === 2) {
                            statusDisplay = '<div class="state"><span class="color-9">已终止</span></div>';
                        }else if (item.Status === 3) {
                            statusDisplay = '<div class="state"><span class="color-9">已废弃</span></div>';
                        } 
                        else {
                            statusDisplay = '<div class="state"><span>未开始</span></div>';
                        }

                        let planRated = item.TradeCount / item.PlansCount * 100;
                        let planRate = kendo.toString(planRated>100?100:planRated, 'n');
                        let tradeRate = '0';

                        if (item.TradeCount <= item.PlansCount) tradeRate = '0';
                        else {
                            tradeRate = kendo.toString((item.TradeCount - item.PlansCount) / item.PlansCount * 100, 'n');
                        }

                        let planRatef = kendo.parseFloat(planRate);
                        let tradeRatef = kendo.parseFloat(tradeRate);

                        planRatef = planRatef > 100 ? 100 : planRatef;
                        tradeRatef = tradeRatef > 100 ? 100 : tradeRatef;

                        return `<div class="cM-box-list">
                                    <div class="list-box">
                                    <div class="t-right float-r t-right-time">
                                    <span class="color-9">合约有效期：</span>
                                    <span>${kendo.toString(new Date(item.BeginDate), 'yyyy.MM.dd')}&ensp;-&ensp;${kendo.toString(new Date(item.EndDate), 'yyyy.MM.dd')}</span>
                                    <i class="iconfont icon-guanbipsd close" dataid="${item.Id}"></i>
                                    </div>
                                    <div class="t-left float-l ma-l30">
                                    <span class="color-9">合约名称：</span>
                                    <span>${item.ContractName}</span>
                                    </div>
                                    <div class="t-left float-l ma-l30">
                                    <span class="color-9">购电方：</span>
                                    <span>${item.SubjectName}</span>
                                    <span class="tip-icon color-blue ma-l4">${item.UsedPowerTypeString}</span>
                                    </div>
                                    <div class="t-right ma-r20 float-r">
                                    <span class="color-9">方式：</span>
                                    <span>${item.ContractTypeString}</span>
                                    </div>
                                    </div>
                                    <div class="b-box">
                                    <div class="td-l-box">
                                    <div class="will-buy">
                                    <div class="echart-box">
                                    <div class="bg-blue" style="width:${planRatef}%">
                                    <p class="echart-label">用电量进度    <span class="color-blue">${planRate}%</span></p>
                                    <p class="echart-p" style="width:300px; margin-top:15px; position:initial"><span class="color-9">总预购</span>  ${item.PlansCount} 万千瓦时</p>
                                    </div>
                                    <div class="bg-red" style="width:${tradeRatef}%">
                                    <p class="echart-label" style="display:${tradeRate === '0' ? 'none' : ''}">用电量进度    <span class="color-red">${tradeRate}%</span></p>
                                    <p class="echart-p" style="width:200px; text-align:right"><span class="color-9">总成交</span>  ${item.TradeCount == null ? 0 : item.TradeCount} 万千瓦时</p>
                                    </div>
                                    </div>
                                    </div>
                                    </div>
                                    ${statusDisplay}
                                    <div class="btn-box"><a class="a-button-xian detail" val="${item.Id}">查看</a></div>
                                    </div></div>`;
                    }
                },
            ]
        });

        $('#iSearch').off().on('click', function () {
            let grid = $('#gridContracts').data('kendoGrid');
            filter.mode = 'fast';
            grid.dataSource.filter('');
        });

        $('#btnSearch').off().on('click', function () {
            let grid = $('#gridContracts').data('kendoGrid');
            filter.mode = 'advance';
            grid.dataSource.filter('');
        });

        let data = [
            { text: '一般工商业用电', value: '0' },
            { text: '大工业用电', value: '1' },
            { text: '居民生活用电', value: '2' },
            { text: '农业生产用电', value: '3' },
        ];

        $('#conditionSelect').kendoDropDownList({
            dataTextField: 'text',
            dataValueField: 'value',
            dataSource: data,
            index: 0
        });
        $('#electricityTypeSelect').kendoDropDownList({
            dataTextField: 'text',
            dataValueField: 'value',
            dataSource: data,
            index: 0,
            optionLabel: '--请选择--',
        });

        $('#resetSeCondition').off('click').on('click', function () {
            $(this).parents('.filtrate-box').find('input[type=\'checkbox\']').prop('checked', false);
            $('#electricityTypeSelect').data('kendoDropDownList').value('');
        });

        $('#gridContracts').on('click', '.eidt', function () {
            let id = $(this).attr('val');
            the.router.navigate([`/sale/contracts/anhui/edit/${id}`]);
        });
        $('#gridContracts').on('click', '.detail', function () {
            let id = $(this).attr('val');
            the.router.navigate([`/sale/contracts/anhui/history/${id}`]);
        });

        $(document).off('click', '#resetSeCondition').on('click', '#resetSeCondition', function () {
            $(this).parents('.filtrate-box').find('input[type=\'checkbox\']').prop('checked', false);
        })
        $(document).off('click', '#selectCondition').on('click', '#selectCondition', function () {
            $('#filtrateBox').slideToggle(100);
        })

        function resizeFunction() {
            let $list = $('.ehart-box');
            $list.each(function () {
                let $willBuy = $(this).find('.will-buy');
                let $bought = $(this).find('.bought');
                const $used = $(this).find('.used');
                let w = $willBuy.find('.echart-box span').width();
                $bought.find('.echart-box span').width($bought.find('.count').text() / $willBuy.find('.count').text() * w);
                $used.find('.echart-box span').width($used.find('.count').text() / $willBuy.find('.count').text() * w);
            })
        }
        resizeFunction();

        // 申报期限设定
        $(document).off('click', '#setLimitDate').on('click', '#setLimitDate', function () {
            the.setDay.opened = true;
        });


        // 删除合约
        let deleteList = {
            dialogDeleteList: $('#dialogDeleteList'),
            deleteNode: $(''),
            contractId: null,
            init: function () {
                this.setDialog();
                this.bindEvent();
            },
            setDialog: function () {
                const delTip = '<div class="text-center dialog-box">'
                    + '<img src="/assets/images/pic-warm.png" class="pd-b20">'
                    + '<p>确认删除此合约？</p>'
                    + '</div>'
                this.dialogDeleteList.kendoDialog({
                    width: '500px',
                    title: '提示',
                    closable: true,
                    modal: false,
                    visible: false,
                    content: delTip,
                    actions: [
                        { text: '取消' },
                        { text: '确认', primary: true, action: deleteList.onOKDeleteIt }
                    ]
                });

            },
            onOKDeleteIt: function () {
                let id = deleteList.deleteNode.attr('dataid');
                the.subscribes.push(the.authService.AuthPost(`${environment.sellerContractApi}api/AHContract/AbandonContract/${id}`, null).subscribe(msg => {
                    const res = msg.json();
                    if (res.result) {
                        deleteList.dialogDeleteList.data('kendoDialog').close();
                        $('#gridContracts').data('kendoGrid').dataSource.read();
                        alert('操作成功。');
                    } else {
                        alert(res.msg);
                    }
                }));
            },
            bindEvent: function () {
                const the = this;
                $(document).off('click', '.close').on('click', '.close', function () {
                    the.dialogDeleteList.data('kendoDialog').open();
                    the.deleteNode = $(this);
                })
            }
        }
        deleteList.init();
    }

    ngOnDestroy(){ 
        this.subscribes.forEach(item => {
            if(item!=null) item.unsubscribe();
        });
    }

}
