import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
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
export class ClientSale implements OnInit, OnDestroy, AfterViewInit {
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
    public CustomerLevelPlaceHolder = { text: '请选择客户等级', value: null };
    public CustomerLevel: Array<{ text: string, value: number }> = [
        { text: '关键客户', value: 1 },
        { text: '主要客户', value: 2 },
        { text: '普通客户', value: 3 }
    ];
    sub1;
    sub2;
    sub3;
    sub4;
    sub5;
    sub6;
    private progressDialog = false;
    public valueHorizontal = 5;
    public valueVertical = 5;
    public min = 0;
    public max = 80;
    public smallStep = 20;
    private active = false;
    private pageId: string;
    progressData = {
        'progressPercent': 0, // 销售进度
        'customerLevel': 0, // 客户等级
        'id': this.route.snapshot.params['id']
    }
    private totleData = {
        'progressPercent': 0, // 销售进度
        'customerLevel': 1, // 客户等级
        'id': this.route.snapshot.params['id']
    };
    // 销售人员
    private salePeople = {};
    private TransferDialog = false;
    TransferData = [];
    TransferPlaceHolder = { fullName: '请选择销售人员', id: null };
    transferData = {
        'Id': this.route.snapshot.params['id'],
        'UserSubjectName': '转移公司2',
        'SaleUserId': '',
        'SaleUserName': '',
        'TransferSaleId': ''
    }
    TypeData: Array<{ text: string, value: number }> = [
        { text: '销售进展', value: 1 },
        { text: '关系维护', value: 2 },
        { text: '续约提醒', value: 3 }
    ]
    TypePlaceHolder = { text: '请选择追踪类型', value: null }
    newClientLoad = {
        type: null,
        Description: '',
        IsPushToSale: false
    }
    transfer() {
        this.TransferDialog = true;
    }
    transferDialogClose() {
        this.TransferDialog = false;
    }

    showDialog() {
        this.active = true;
    }

    closeForm() {
        this.active = false;
    }

    onSave(e, m) {
        const postData = m.value;
        postData.SellerSubjectId = this.pageId;
        this.sub1 = this.auth.post(`${environment.sellerCRMApi}api/CustomerSX/CreateCustomerTrack`, postData)
            .subscribe((res) => {
                if (res.json().return_code === 'SUCCESS') {
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
        listService.SellerSubjectID = route.snapshot.params['id'];
        this.view = listService;
        this.listService.query(this.state);

        logInfo.SellerSubjectID = route.snapshot.params['id'];
        this.logInfoView = logInfo;
        this.logInfo.query(this.loginfoState);

        this.pageId = route.snapshot.params['id'];

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
    onTransferSave() {
        this.sub2 = this.auth.post(`${environment.sellerCRMApi}api/CustomerSX/TransferCustomer`, this.transferData)
            .subscribe((res) => {
                if (res.json().return_code === 'SUCCESS') {
                    this.getSalePeople();
                    this.TransferDialog = false;
                }
            })
    }

    ngAfterViewInit() {
        const _this = this;
        function dateChange() {
            _this.logInfo.createDate = `${this.value().getFullYear()}-${this.value().getMonth() + 1}`;
            _this.logInfo.query({
                skip: 0,
                take: 5
            });
        }
        $('#monthpicker').kendoDatePicker({
            start: 'year',
            depth: 'year',
            format: 'yyyy MMMM',
            change: dateChange
        });
    }
    getSalePeople() {
        // 销售人员
        this.sub3 = this.auth.get(
            `${environment.sellerCRMApi}api/CustomerSX/GetSalerInformation/?sellerSubjectID=${this.route.snapshot.params['id']}`)
            .subscribe((res) => {
                const result = res.json();
                if (result.SaleUserId != null && result.SaleUserId !== undefined && result.SaleUserId !== '') {
                    this.transferData.TransferSaleId = result.salerId;
                    this.transferData.SaleUserName = result.salerName;
                }
                this.salePeople = result;
            })

    }
    ngOnInit() {
        this.getSalePeople();

        // 销售人员列表
        this.sub4 = this.auth.get(`${environment.sellerCRMApi}api/CustomerSX/GetSalesList`)
            .subscribe((res) => {
                this.TransferData = res.json();
            })

        this.sub5 = this.auth.get(
            `${environment.sellerCRMApi}api/CustomerSX/GetSellerSubjectById/?sellerSubjectId=${this.route.snapshot.params['id']}`)
            .subscribe((res) => {
                const result = res.json();
                this.transferData.UserSubjectName = result.subjectName;
                this.totleData.progressPercent = result.value.progressPercent;
                this.totleData.customerLevel = result.value.customerLevel;
                this.progressData.progressPercent = result.value.progressPercent;
                this.progressData.customerLevel = parseInt(result.value.customerLevel);
            })
    }

    progressDialogClose() {
        this.progressDialog = false;
    }
    setProgress() {
        this.progressDialog = true;
    }
    onProgressSave(m) {
        this.sub6 = this.auth.post(`${environment.sellerCRMApi}api/CustomerSX/UpdateCustomerProgressPercent`, this.progressData)
            .subscribe((res) => {
                console.log(res);
                if (res.json().return_code === 'SUCCESS') {
                    this.totleData = this.progressData;
                    this.progressDialog = false;
                }
            })
    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe(); }
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe(); }
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe(); }
        if (this.sub4 !== undefined && this.sub4 !== null) { this.sub4.unsubscribe(); }
        if (this.sub5 !== undefined && this.sub5 !== null) { this.sub5.unsubscribe(); }
        if (this.sub6 !== undefined && this.sub6 !== null) { this.sub6.unsubscribe(); }
    }
}
