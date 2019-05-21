import { Component, OnDestroy, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { AuthHttpService } from '../../../../../+common/services/auth-http.service';
import { DetailService } from '../detail.service';
import { ContractService } from './contract.service';
import { Observable } from 'rxjs/Rx';
import { State, process } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../+common/services/auth.service';
declare var $: any;
import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';

declare var kendo: any;
@Component({
    selector: 'client-detai-contract-manage',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.scss']
})


export class ClientContract implements OnDestroy, OnInit {

    // 日期
    public PowerContractHolder = { text: '2017', value: '2017' };
    filters={
       PowerContract: '2017',

    }


    public PowerContract: Array<{ text: string, value: number }> =    [
            { text: '2017', value: 1 },
            { text: '2016', value: 2 },
            { text: '2015', value: 3 },
        ];

  PowerContractChange(e) {
    debugger;
        this.filters.PowerContract = e.text;
    }

    private gridData = [];
    private titleResult = {};
    public view: Observable<GridDataResult>;
    contractTypeName = ['长协', '竞价', '长协+竞价'];
    usedPowerType = ['工业', '工商业', '居民', '农业'];
    titleData = {};
    sub1;
    public state: State = {
        skip: 0,
        take: 10
    };
    public onStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.contract.query(state);
    }
    constructor(
        private service: DetailService,
        public route: ActivatedRoute,
        private auth: AuthHttpService,
        private router: Router,
        private authService: AuthService,
        private contract: ContractService) {
        service.setActive('contract');
        contract.SellerSubjectID = route.snapshot.params['id'];
        this.view = contract;
        this.contract.query(this.state);
    }
    public data={};
    public dataSource={};
    public datas={};
    ngOnInit() {
        let sellerSubjectID = this.route.snapshot.params['id'];

        let the= this;
        // tab
         var statusVal = 0;

         $(document).on("click", ".customer-table a", function () {
            $(this).addClass("active").removeClass("color-9").siblings().removeClass("active").addClass("color-9");
            statusVal = $(this).attr("name");
        });
        this.auth.get(`${environment.sellerCRMApi}api/ContractManage/ClientContract/?sellerSubjectId=${this.route.snapshot.params['id']}`)
            .subscribe((res) => {

                this.titleData = res.json();

            })



        //合约信息

          function createChart1() {

            $("#chart1").kendoChart({
                dataSource:{

                      transport: {
                        read: function (f) {

                            let totalurl = `${environment.sellerSettlementApi}api/AHOneCustomerExecuteInfo/GetCustomerSettlement`;

                             the.authService.AuthPost(totalurl,{SellerSubjectId:sellerSubjectID,Year:2017})
                            .subscribe((res) => {
                               let result = res.json();
                               f.success(result.data);
                            })

                            }

                    },



                },
                legend: {
                    position: "bottom"
                },
                seriesDefaults: {
                    type: "line"
                },
                series: [{
                    field: "netIncome",
                    name: "净收益",
                    color:"#5B9BD5",

                   /*notes: {
                        label: {
                            position: "outside"
                        },
                        position: "bottom"
                    }*/
                },

                ],
                valueAxis: {
                    line: {
                        visible: false
                    },
                    majorUnit: 80000
                },
                categoryAxis: {
                    field: "month",
                    majorGridLines: {
                        visible: false
                    }
                },
                tooltip: {
                    visible: true,
                    template: "#= series.name #: #= value #"
                }
            });
        }

     $(document).ready(createChart1);
     $(document).bind("kendo:skinChange", createChart1);




    $("#licence-btn").click(function () {
            $(this).addClass("active");
            $("#basic-btn").removeClass("active");
            $("#Basic").hide();
            $("#Licence").show();
        });

     $("#basic-btn").click(function () {
                $(this).addClass("active");
                $("#licence-btn").removeClass("active");
                $("#Basic").show();
                $("#Licence").hide();
            });


    // zhi行信息列表
    debugger;
      $("#grid-hy").kendoGrid({

            dataSource: {
                 transport: {
                        read: function (f) {

                            let totalurl = `${environment.sellerSettlementApi}api/AHOneCustomerExecuteInfo/GetCustomerSettlement`;

                             the.authService.AuthPost(totalurl,{SellerSubjectId:151,Year:2017})
                            .subscribe((res) => {
                               let result = res.json();

                            f.success(result.data);
                            })

                            }

                    },

            },

            noRecords: true,
            messages: {
                noRecords: "当前没有任何数据"
            },
            columns: [
                {
                    field: "Year", title: "用电周期", width: "270px",
                    template: function (item) {
                            if(item.month<10) return `${item.year}年0${item.month}月`;
                            return `${item.year}年${item.month}月`;
                        }
                 },
                {
                    field: "year", title: "类型",
                    template: function () {
                        return '<p class="plan-list">长协</p><p class="line plan-list">竞价</p>'
                    },
                    width: "160px"
                },
                {
                    field: "bidActualPurchaseAmount", title: "预购电量<p>(万千瓦时)</p>",
                    template: function (item) {
                            return `${item.longAmount}<br>${item.bidAmount}`

                        }
                },

                {
                    field: "longActualPurchaseAmount", title: "交易电量<p>(万千瓦时)</p>",
                    template: function (item) {
                            return `${item.longActualPurchaseAmount}<br>${item.bidActualPurchaseAmount}`

                        }

                },

                {
                    field: "actualUsedAmount", title: "实际用电量<p>(万千瓦时)</p>",

                },

                {
                    field: "deviationElecQuantity", title: "偏差电量<p>(万千瓦时)</p>",

                },
                 {
                    field: "customerIncome", title: "客户收益<p>(元)</p>",

                },

                 {
                    field: "deviationAmount", title: "偏差惩罚金额<p>(元)</p>",

                },
                {
                    field: "netIncome", title: "净收益<p>(元)</p>",
                },


            ]
        });





    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe(); }
    }
}
