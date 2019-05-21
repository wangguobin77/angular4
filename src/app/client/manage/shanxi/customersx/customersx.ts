import { Component, Output, EventEmitter, OnInit, OnDestroy, ViewEncapsulation, Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { State } from '@progress/kendo-data-query';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../+common/services/auth.service';

import 'rxjs/add/operator/map';



import 'rxjs/add/operator/catch'


import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';

declare var $: any;
@Component({
    selector: 'customersx',
    templateUrl: './customersx.html',
    styleUrls: ['./customer.scss']
})
export class customersx implements OnDestroy{
    sub1;
    public data={};
    public basicInfo = {};
    public searchBoxContent = '';
    constructor(private router: Router, private authService: AuthService, private http: Http, private route: ActivatedRoute) {

    }
    public datas={};
    // 合约年份
    //
    public PowerContractHolder = { text: '2017', value: '2017' };
    filters={
       PowerContract: '2017',

    }
    public year="";

    public PowerContract: Array<{ text: string, value: number }> =    [
            { text: '2017', value: 1 },
            { text: '2016', value: 2 },
            { text: '2015', value: 3 },
        ];

  PowerContractChange(e) {
        debugger;
        this.filters.PowerContract = e.text;
        window.location.href=location.href
    }


    ngOnInit() {


        var statusVal = 0;

         $(document).on("click", ".customer-table a", function () {
            $(this).addClass("active").removeClass("color-9").siblings().removeClass("active").addClass("color-9");
            statusVal = $(this).attr("name");
        });


    // 用电信息年份

        var yearsDate = [
            {
                text: "2017",
                value: "2017"
            },
            {
                text: "2016",
                value: "2016"
            },
            {
                text: "2015",
                value: "2015"
            }
        ];
        $("#years").kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: yearsDate,
            index: 1
        });





        //  客户详情

        let sellerSubjectID = this.route.snapshot.params['id'];

        let url = `api/customerGD/detail/?id=${sellerSubjectID}`;

        let totalurl = `${environment.sellerCRMApi}${url}`;

        this.sub1 = this.authService.AuthGet(totalurl).subscribe((res) => {
          const result = res.json();
          this.basicInfo = result.customerGDBaseInfo;
        });

        let yearVal="";
        $("#years").on("change",function(){
            yearVal=$("#years").val();
            // window.location.reload();
            document.execCommand('Refresh')

        })
        // 用电信息
       let the=this;
         debugger;
         function createChart() {

            $("#chart").kendoChart({
                dataSource: {
                    transport:{
                        read: function (f) {
                            the.authService.AuthGet(`http://10.96.227.235:5000/api/CustomerGD/CustomerElectricStatistic?sellerSubjectID=${sellerSubjectID}&year=`).subscribe(function (res) {
                                let data = res.json();
                                f.success(data);

                            });
                        }
                    },
                },
                legend: {
                    position: "top"
                },
                seriesDefaults: {
                    type: "column"
                },
                series: [{
                    color: "#3399FF",
                    field:"planAmount",
                    name: "预售电量",
                    //data: [3.907, 7.943, 7.848, 9.284, 9.263, 9.801, 3.890, 8.238, 9.552, 6.855]
                }, {
                    name: "交易电量",
                    field:"actualAmount",
                    color:"#99CC00",
                    //data: [4.743, 7.295, 7.175, 6.376, 8.153, 8.535, 5.247, 7.832, 4.3, 4.3]
                }, {
                    name: "实用电量",
                    field:"usedAmount",
                    color:"#FF9900",
                    //data: [0.010, 0.375, 1.161, 0.684, 3.7, 3.269, 1.083, 5.127, 3.690, 2.995]
                },{
                    name: "能效路由数据",
                    field:"meterAmount",
                    color:"#999900",
                    //data: [1.988, 2.733, 3.994, 3.464, 4.001, 3.939, 1.333, 2.245, 4.339, 2.727]
                }],
                valueAxis: {
                    labels: {
                        format: "{0}"
                    },
                    line: {
                        visible: false
                    },
                    axisCrossingValue: 0
                },
                categoryAxis: {
                    field:"month",
                    //categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12],
                    majorUnit: 10000,
                    line: {
                        visible: false
                    },
                    labels: {
                        padding: {top: 10}
                    }
                },
                tooltip: {
                    visible: true,
                    format: "{0}",
                    template: "#= series.name #: #= value #"
                }
            });

        }

        //createChart();
        $(document).ready(createChart);
        $(document).bind("kendo:skinChange", createChart);


        //合约信息


        var grandSlam = [
                {
                    "year": "1",
                    "win": 13,
                    "extremum": "MIN: 13",

                }, {
                    "year": "2",
                    "win": 22,

                }, {
                    "year": "3",
                    "win": 24,

                }, {
                    "year": "4",
                    "win": 27,
                    "extremum": "MAX: 27",

                }, {
                    "year": "5",
                    "win": 26,

                }, {
                    "year": "6",
                    "win": 24,

                }, {
                    "year": "7",
                    "win": 26,

                }, {
                    "year": "8",
                    "win": 20,

                }, {
                    "year": "9",
                    "win": 20,

                }, {
                    "year": "10",
                    "win": 19,

                }, {
                    "year": "11",
                    "win": 19,

                }, {
                    "year": "12",
                    "win": 19,

                }];

           //图表渲染
        function createChart1() {
            debugger;
            let the=this;
            $("#chart1").kendoChart({
                dataSource: {
                    read: function (f) {
                        the.authService.AuthGet(`http://10.96.227.235:5000/api/Customer/CustomerElectricStatistic?sellerSubjectID=${sellerSubjectID}&year=${yearVal}`).subscribe(function (res) {
                            let result = res.json();
                               this.datas = result.data;
                               console.dir(this.datas);
                            f.success(res.json());
                        });
                    }
                },
                legend: {
                    position: "bottom"
                },
                seriesDefaults: {
                    type: "line"
                },
                series: [{
                    field: "win",
                    name: "净收益",
                    color:"#FFBF00",
                    noteTextField: "extremum",
                    notes: {
                        label: {
                            position: "outside"
                        },
                        position: "bottom"
                    }
                },

                 {
                    field: "loss",
                    name: "客户承担偏差",
                    color:'#5EA5F5'
                },{
                    field: "ccc",
                    name: "公司承担偏差",
                    color:'#00CC99'
                }],
                valueAxis: {
                    line: {
                        visible: false
                    }
                },
                categoryAxis: {
                    field: "year",
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

    createChart1();


    // 最新报价消息获取

        let urlNew = `http://10.96.227.247:99/api/AHQuoteProgram/GetCustomerLatestSalePackages?id=172`;

        // let total = `${environment.sellerCRMApi}${urlNew}`;

        this.authService.AuthGet(urlNew).subscribe((res) => {
          const result = res.json();
          this.datas = result.data;
          console.log(this.datas);
        });










    }

     ngOnDestroy(): void {
    if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe(); }
  }

}
