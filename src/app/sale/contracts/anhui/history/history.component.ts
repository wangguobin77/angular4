import { Component, OnInit, ViewEncapsulation,OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../+common/services/auth.service';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import {
    FormGroup,
    FormControl
} from '@angular/forms';


import { environment } from '../../../../../environments/environment';

declare var $: any;
declare var kendo: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'history',
    templateUrl: './history.html',
    styleUrls: ['./history.css']
})
export class HistoryComponent implements OnDestroy {
    sub1;sub2;sub3;
    constructor(private router: Router, private authService: AuthService, private http: Http, private route: ActivatedRoute) {
        
    }

    currentUrl: string;

    detailUrl: string;

    opened: boolean = false;

    close(v) {
        this.opened = false;
    }

    refresh() {
        this.opened = false;
        $("#grid").data("kendoGrid").dataSource.filter("");
    }

    submit(e) {
        e.preventDefault();

        let _this = this;

        _this.bidAmountModel.bidAmount = _this.bidAmountForm.value["bidAmount"];

        this.sub1=_this.authService.AuthPost(`${environment.sellerContractApi}api/AHContract/UpdateBidPlanAmount`, _this.bidAmountModel).subscribe(function (res) {
            //let msg = res.json();
            //alert(msg.);
            _this.refresh();
        });
    }

    bidAmountForm: FormGroup = new FormGroup({
        bidAmount: new FormControl()
    });

    bidAmountModel = {
        id: 0,
        date: "",
        bidAmount: 0
    };

    //合约概况
    contractInfo = {
        BeginDate: "",
        EndDate: "",
        ValidDate: "",
        ContractType: -1,
        TradeCount: 0,
        PlansCount:0,
        PlanRate: "",
        TradeRate: "",
        PlanRatef: "",
        TradeRatef: ""
    };

    ngOnInit() {

        let _this = this;

        let id = _this.route.snapshot.params['id'];

        _this.currentUrl = _this.router.url;
        _this.detailUrl = `/sale/contracts/anhui/detail/${id}`;

        
        let v = -1; 
        let arr = [];
        let saveStateArr = [];

        //合约概况
        this.sub2=_this.authService.AuthGet(`${environment.sellerContractApi}api/AHContract/GetContractInfo/${id}`).subscribe(function (res) {
            _this.contractInfo = res.json();
            _this.contractInfo.ValidDate = `${kendo.toString(new Date(_this.contractInfo.BeginDate), "yyyy.MM.dd")} - ${kendo.toString(new Date(_this.contractInfo.EndDate), "yyyy.MM.dd")}`;

            let PlanRatef = kendo.parseFloat(kendo.toString(_this.contractInfo.TradeCount / _this.contractInfo.PlansCount * 100, "n"));
            let TradeRatef = kendo.parseFloat(kendo.toString((_this.contractInfo.TradeCount - _this.contractInfo.PlansCount) / _this.contractInfo.PlansCount * 100, "n"));

            _this.contractInfo.PlanRate = PlanRatef + "%";
            _this.contractInfo.PlanRatef = (PlanRatef > 100 ? 100 : PlanRatef) + "%";

            if (_this.contractInfo.TradeCount <= _this.contractInfo.PlansCount) {
                _this.contractInfo.TradeRate = "0%";
                _this.contractInfo.TradeRatef = "0%";
            }
            else {
                _this.contractInfo.TradeRate = TradeRatef + "%";
                _this.contractInfo.TradeRatef = (TradeRatef > 100 ? 100 : TradeRatef) + "%";
            }

            v = _this.contractInfo.ContractType;
            loadGrid();
        });

        let loadGrid = function () {
            //合约类型（1长协，2竞价）
            if (v == 1) {
                arr = [
                    {
                        field: "planDate", title: "用电周期",
                        template: function (item) {
                            return kendo.toString(new Date(item.planDate), "yyyy年MM月");
                        }
                    },
                    { field: "longAmount", title: "总预购电量<span class='size-12'>(万千瓦时)</span>" },
                    { field: "longActualPurchaseAmount", title: "交易电量<span class='size-12'>(万千瓦时)</span>" },
                    //{ field: "longUnitPrice", title: "长协价差<span class='size-12'>(元/千瓦时)</span>" },
                ]
            }
            else if (v == 2) {
                arr = [
                    {
                        field: "planDate", title: "用电周期",
                        template: function (item) {
                            return kendo.toString(new Date(item.planDate), "yyyy年MM月");
                        }
                    },
                    { field: "bidAmount", title: "总预购电量<span class='size-12'>(万千瓦时)</span>" },
                    { field: "bidActualPurchaseAmount", title: "交易电量<span class='size-12'>(万千瓦时)</span>" },
                    //{ field: "bidUnitPrice", title: "竞价价差<span class='size-12'>(厘/千瓦时)</span>" },
                    {
                        command: [{
                            text: "月度竞价申报",
                            click: function (e, d) {
                                e.preventDefault();
                                var item = this.dataItem($(e.currentTarget).closest("tr"));

                                _this.bidAmountModel.id = item.id;
                                _this.bidAmountModel.date = kendo.toString(new Date(item.planDate), "yyyy年MM月");
                                _this.bidAmountModel.bidAmount = item.bidAmount;

                                _this.opened = true;

                            }
                        }], title: "&nbsp;", width: "250px"
                    }

                ]
            }

            $("#grid").kendoGrid({
                dataSource: {
                    transport: {
                        read: function (f) {
                            this.sub3=_this.authService.AuthGet(`${environment.sellerContractApi}api/AHContract/GetContractPlans/${id}`).subscribe(function (res) {
                                f.success(res.json());
                            });
                        }
                    },
                    schema: {
                        data: function (response) {
                            return response.data;
                        },
                        total: function (response) {
                            return response.total;
                        }
                    },
                    //serverPaging: true,
                    serverFiltering: true
                },
                pageable: false,
                columns: arr
            });
        };
    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe();}
    }
}