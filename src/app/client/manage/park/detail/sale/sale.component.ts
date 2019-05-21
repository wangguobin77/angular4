import { Component, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { DetailService } from '../detail.service';
import { Observable } from 'rxjs/Observable';
import { AuthHttpService } from '../../../../../+common/services/auth-http.service';
import { environment } from '../../../../../../environments/environment';
import { SaleService } from './sale.service';
import { LogInfoService } from './logInfo.service';
import { State } from '@progress/kendo-data-query';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../../+common/services/auth.service';
import 'rxjs/add/operator/map';
import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';
declare var $: any;
@Component({
    selector: 'client-detai-sale',
    templateUrl: './sale.component.html',
    styleUrls: ['./sale.scss']
})
export class ParkSale {
    private gridData = [];
    public view: Observable<GridDataResult>;
    public logInfoView: Observable<GridDataResult>;
    public state: State = {
        skip: 0,
        take: 5
    };
    public loginfoState: State = {
        skip: 0,
        take: 5
    };
    sub1;
    sub2;
    sub3;
    sub4;
    sub5;
    sub6;
    isTransfer = true;
    constructor(
        private route: ActivatedRoute,
        private service: DetailService,
        private auth: AuthHttpService,
        private listService: SaleService,
        private logInfo: LogInfoService,
        private base:AuthService
    ) {
        service.setActive('sale');
        listService.SellerSubjectID = route.snapshot.params["id"];
        this.view = listService;
        this.listService.query(this.state);

        logInfo.SellerSubjectID = route.snapshot.params["id"];
        this.logInfoView = logInfo;
        this.logInfo.query(this.loginfoState);

        this.pageId = route.snapshot.params["id"];
        this.isTransfer = this.base.IsInRole("CustomerService");
    }
    public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.listService.query(state);
    }
    public logInfoDataStateChange(state: DataStateChangeEvent): void {
        this.loginfoState = state;
        this.logInfo.query(state);
    }

    private active: boolean = false;
    private pageId: string;
    showDialog() {
        this.active = true;
    }
    TypeData: Array<{ text: string, value: number }> = [
        { text: "销售进展", value: 1 },
        { text: "关系维护", value: 2 },
        { text: "续约提醒", value: 3 }
    ]
    TypePlaceHolder = { text: "请选择追踪类型", value: null }

    closeForm() {
        this.active = false;
    }
    newClientLoad = {
        type: null,
        Description: '',
        IsPushToSale: false
    }
    onSave(e, m) {
        let postData = m.value;
        postData.SellerSubjectId = this.pageId;
        this.auth.post(`${environment.sellerCRMApi}api/SellerPark/CreateParkTrack`, postData).subscribe((res) => {
            if (res.json().return_code == "SUCCESS") {
                this.listService.query({
                    skip: 0,
                    take: 5
                });
                this.active = false;
                this.newClientLoad = {
                    type: null,
                    Description: '',
                    IsPushToSale: false
                }
            }
        })
    }

    // 销售人员
    private salePeople = {};
    private TransferDialog: boolean = false;
    transfer() {
        this.TransferDialog = true;
    }
    TransferData = [];
    TransferPlaceHolder = { fullName: "请选择销售人员", id: null };
    transferDialogClose() {
        this.TransferDialog = false;
    }
    transferData = {
        "Id": this.route.snapshot.params["id"],
        "UserSubjectName": "转移公司2",
        "SaleUserId": "",
        "SaleUserName": "",
        "TransferSaleId": ""
    }
    //保存客户转移
    onTransferSave() {
        this.auth.post(`${environment.sellerCRMApi}api/SellerPark/TransferPark`, this.transferData).subscribe((res) => {
            if (res.json().return_code == "SUCCESS") {
                this.getSalePeople();
                this.TransferDialog = false;
            }
        })
    }
    progressData = {
        "progressPercent": 0, //销售进度
        "customerLevel": 0,//客户等级
        "id": this.route.snapshot.params["id"]
    }
    private totleData = {
        'progressPercent': 0, // 销售进度
        'customerLevel': 1, // 客户等级
        'id': this.route.snapshot.params['id']
    };
    ngAfterViewInit() {
        var _this = this;
        function dateChange() {
            _this.logInfo.createDate = `${this.value().getFullYear()}-${this.value().getMonth() + 1}`;
            _this.logInfo.query({
                skip: 0,
                take: 5
            });
        }
        $("#monthpicker").kendoDatePicker({
            start: "year",
            depth: "year",
            format: "yyyy MMMM",
            change: dateChange
        });
    }
    getSalePeople() {
        // 销售人员
        this.auth.get(
            `${environment.sellerCRMApi}api/SellerPark/GetParkSaleInfo/?id=${this.route.snapshot.params["id"]}`
        ).subscribe((res) => {
            let result = res.json();
            if (result.SaleUserId != null && result.SaleUserId != undefined && result.SaleUserId != "") {
                this.transferData.TransferSaleId = result.salerId;
                this.transferData.SaleUserName = result.salerName;
            }
            this.salePeople = result;
        })

    }
    ngOnInit() {

        this.getSalePeople();

        //销售人员列表
        this.auth.get(`${environment.sellerCRMApi}api/SellerPark/GetSalesList`).subscribe((res) => {
            this.TransferData = res.json();
        })
        //基础信息
        this.auth.get(
            `${environment.sellerCRMApi}api/SellerPark/GetSellerParkById/?id=${this.route.snapshot.params["id"]}`
        ).subscribe((res) => {
            const result = res.json();
            this.transferData.UserSubjectName = result.sellerParkName;
            this.totleData.progressPercent = result.progressPercent;
            this.totleData.customerLevel = result.customerLevel;
            this.progressData.progressPercent = result.progressPercent;
            this.progressData.customerLevel = parseInt(result.customerLevel);
        })
    }
    public CustomerLevelPlaceHolder = { text: "请选择客户等级", value: null };
    public CustomerLevel: Array<{ text: string, value: number }> = [
        { text: "关键客户", value: 1 },
        { text: "主要客户", value: 2 },
        { text: "普通客户", value: 3 }
    ];
    private progressDialog: boolean = false;
    public valueHorizontal: number = 5;
    public valueVertical: number = 5;
    public min: number = 0;
    public max: number = 80;
    public smallStep: number = 20;
    progressDialogClose() {
        this.progressDialog = false;
    }
    setProgress() {
        this.progressDialog = true;
    }
    onProgressSave(m) {

        this.auth.post(`${environment.sellerCRMApi}api/SellerPark/UpdateParkProgressPercent`, this.progressData).subscribe((res) => {
            console.log(res);
            if (res.json().return_code == "SUCCESS") {
                this.totleData = this.progressData;
                this.progressDialog = false;
            }
        })
    }
}