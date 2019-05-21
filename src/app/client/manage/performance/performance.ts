﻿import { Input, Component, Output, EventEmitter, ViewEncapsulation, Injectable, OnInit } from '@angular/core';


import { Observable } from 'rxjs/Observable';

import { State,CompositeFilterDescriptor } from '@progress/kendo-data-query';

import 'rxjs/add/operator/map';


import { environment } from '../../../../environments/environment';

import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { AuthHttpService } from '../../../+common/services/auth-http.service';

import { AuthService } from '../../../+common/services/auth.service';

import { DataService } from './performance.service';

import 'rxjs/add/operator/map';



import 'rxjs/add/operator/catch';

import {

    GridDataResult,

    DataStateChangeEvent

} from '@progress/kendo-angular-grid';



declare var $: any;

declare var kendo: any;

@Component({

    selector: 'Performance',

    templateUrl: './performance.component.html',

    styleUrls: ['./performance.scss']

})

export class Performance{

    private filtrateBoxIsSHow = false;

    public view: Observable<GridDataResult>;

    public state: State = {

        skip: 0,

        take: 5

    };


    isChecked = [
        {
            boo:false,
            num:0
        },
        {
            boo:false,
            num:1
        },
        {
            boo:false,
            num:2
        }
    ]

    private filters = {

        ContractStatus: [],

    };

    public searchBoxContent = '';
    sub1;

    sub2;






    constructor(public service: DataService, private auth: AuthHttpService,private authService: AuthService, private http: Http) {


        this.view = service;

        this.service.query(this.state);

    }

    public dataStateChange(state: DataStateChangeEvent): void {

        this.state = state;

        this.service.query(state);

    }

    //subs:Array<any>=[];
    public data = {};

    public datas = {};

    //filterbox 显示
    showFiltrateBox() {
        this.filtrateBoxIsSHow = !this.filtrateBoxIsSHow;
    }



    ngOnInit(authSvc: AuthService) {
        let _this = this;
        $.showSide(10102);


         $("#years").kendoDropDownList({
            dataTextField: "planYear",
            dataValueField: "planYear",
            dataSource: {
                transport: {
                    read: function (f) {
                        this.sub1=_this.authService.AuthGet(`${environment.sellerContractApi}api/AHPowerDistribution/AHContractExecuteYear`).subscribe(function (res) {
                            f.success(res.json());
                        });
                    }
                }
            },
        });


        var filter = {
            advance: function () {
                var filters1 = [];
                var year = $("#years").data("kendoDropDownList").value();
                if (year != "") {
                    filters1.push(`PlanYear~eq~${year}`);
                    return filters1.join("");
                }
                return "";
            },
            get: function () {
                return filter.advance();
            }
        };



     //信息的读取

        //let Info = `api/CustomerCountAndAnalysis/GetCustomerCountInfo/`;

        //let totalInfo = `${environment.sellerCRMApi}${Info}`;

        let totalInfo=`${environment.sellerCRMApi}api/CustomerCountAndAnalysis/GetSellerSubjectCountStatistics/`;

        _this.authService.AuthGet(totalInfo).subscribe((res) => {

            let result = res.json();

          _this.data = result;

        });


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
            debugger;


    // 图表
       function createChart() {
            $("#chart").kendoChart({
                dataSource: {
                    data: grandSlam
                },
                legend: {
                    position: "bottom"
                },
                seriesDefaults: {
                    type: "line"
                },
                series: [{
                    field: "win",
                    name: "Wins",
                    noteTextField: "extremum",
                    notes: {
                        label: {
                            position: "outside"
                        },
                        position: "bottom"
                    }
                }, {
                    field: "loss",
                    name: "Losses"
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

    createChart();


    function ringChart() {
            $("#ringChart").kendoChart({
                legend: {
                    position: "right"
                },
                seriesDefaults: {
                    labels: {
                        template: "#= category # - #= kendo.format('{0:P}', percentage)#",
                        position: "outsideEnd",
                        visible: true,
                        background: "transparent"
                    }
                },
                series: [{
                    type: "donut",
                    data: [{
                        category: "关键客户",
                        value: 35
                    }, {
                        category: "主要客户",
                        value: 25
                    }, {
                        category: "普通客户",
                        value: 20
                    },]
                }],
                tooltip: {
                    visible: true,
                    template: "#= category # - #= kendo.format('{0:P}', percentage) #"
                }
            });
        }

    ringChart();


    // 区域分布
     function createChart1() {
            $("#chart1").kendoChart({
                title: {
                    // text: "What is you favourite sport?"
                },
                legend: {
                   position: "top"
                },
                seriesDefaults: {
                    labels: {
                        template: "#= category # - #= kendo.format('{0:P}', percentage)#",
                        position: "outsideEnd",
                        visible: true,
                        background: "transparent"
                    }
                },
                series: [{
                    type: "pie",
                    data: [{
                        category: "Football",
                        value: 35
                    }, {
                        category: "Basketball",
                        value: 25
                    }, {
                        category: "Volleyball",
                        value: 20
                    }, {
                        category: "Rugby",
                        value: 10
                    }, {
                        category: "Tennis",
                        value: 10
                    }]
                }],
                tooltip: {
                    visible: true,
                    template: "#= category # - #= kendo.format('{0:P}', percentage) #"
                }
            });
        }

       createChart1();

       // 行业分布
     function createChart2() {
            $("#chart2").kendoChart({
                title: {
                    // text: "What is you favourite sport?"
                },
                legend: {
                   position: "top"
                },
                seriesDefaults: {
                    labels: {
                        template: "#= category # - #= kendo.format('{0:P}', percentage)#",
                        position: "outsideEnd",
                        visible: true,
                        background: "transparent"
                    }
                },
                series: [{
                    type: "pie",
                    data: [{
                        category: "Football",
                        value: 35
                    }, {
                        category: "Basketball",
                        value: 25
                    }, {
                        category: "Volleyball",
                        value: 20
                    }, {
                        category: "Rugby",
                        value: 10
                    }, {
                        category: "Tennis",
                        value: 10
                    }]
                }],
                tooltip: {
                    visible: true,
                    template: "#= category # - #= kendo.format('{0:P}', percentage) #"
                }
            });
        }

       createChart2();



















        $("#years").change(function () {
            var grid = $("#grid").data("kendoGrid");

            grid.dataSource.filter("");
        });


    }

}