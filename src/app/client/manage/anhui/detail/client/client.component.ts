import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { AuthHttpService } from '../../../../../+common/services/auth-http.service';
import { environment } from '../../../../../../environments/environment';
import { DetailService } from '../detail.service';
import { ClientService } from './client.service';
import { Observable } from 'rxjs/Observable';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { State } from '@progress/kendo-data-query';
import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';
import { Product } from './model';

declare var $: any;
@Component({
    selector: 'client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.scss']
})
export class Client implements OnInit, OnDestroy {
    public id: number;
    public basicInfo = {};
    public editInfo = {};
    public isEdit = false;
    private headers = new Headers({ 'Content-Type': 'application/json' });
    public CategoryName: Array<string> = [];
    public activate = new EventEmitter<string>();
    public placeHolder: { categoryName: string, id: number } = { categoryName: '选择用电客户行业类别', id: null };
    public resa: any;
    CategoryNameReady = false;
    private aptData = [];
    private aptIsNew = true;
    private licenseData = [];
    private licenseIsNew = true;
    public view: Observable<GridDataResult>;
    public state: State = {
        skip: 0,
        take: 5
    };
    private editForm = new FormGroup({
        'id': new FormControl(),
        'contacts': new FormControl('', Validators.required),
        'position': new FormControl(),
        'tel': new FormControl('', Validators.required),
        'remark': new FormControl()
    });
    private isNew = false;
    private active = false;
    voltageLevelArr = ['不满1千伏','1-10千伏','20千伏','35千伏','35-110千伏','110千伏','220千伏','220千伏及以上'];
    private voltageLevelData:Array<{text:string,value:number}> = [
        {text:"不满1千伏",value:1},
        {text:"1-10千伏",value:2},
        {text:"20千伏",value:3},
        {text:"35千伏",value:4},
        {text:"35-110千伏",value:5},
        {text:"110千伏",value:6},
        {text:"220千伏",value:7},
        {text:"220千伏及以上",value:8}
    ]

    sub1;
    sub2;
    sub3;
    sub4;
    sub5;
    sub6;
    sub7;

    constructor(
        public auth: AuthHttpService,
        public route: ActivatedRoute,
        public http: Http,
        public service: DetailService,
        private contractService: ClientService
    ) {
        service.setActive('client');

        // 联系人列表
        contractService.SellerSubjectID = route.snapshot.params['id'];
        this.view = contractService;
        this.contractService.query(this.state);
    }
    subCategoryName:Array<string> = [];
    getCategoryName() {
        const getCategoryNameUrl = `${environment.sellerCRMApi}api/Customer/GetCategoryFirst/`;
        this.sub2 = this.auth.get(getCategoryNameUrl).subscribe((res) => {
            const result = res.json();
            this.CategoryName = result;
        })
    }
    getSubCategoryName(categoryNameId) {
        const getCategoryNameUrl = `${environment.sellerCRMApi}api/Customer/GetCategorySecond/?parentId=${categoryNameId}`;
        this.sub3 = this.auth.get(getCategoryNameUrl).subscribe((res) => {
            const result = res.json();
            this.subCategoryName = result;
        });
    }
    categoryNameChange(e) {
        this.subCategoryName = [];
        this.getSubCategoryName(e);
    }
    baseInEdit() {
        this.isEdit = true;
    }
    submitBaseInfo() {
        const clientUrl = `${environment.sellerCRMApi}api/Customer/ModifyCustomer/`;
        this.sub2 = this.auth.post(clientUrl, this.editInfo)
            .subscribe((res) => {
                if (res.json().return_code === 'SUCCESS') {
                    this.getTotle();
                    this.isEdit = false;
                }
            })
    }
    cancelBaseInfo() {
        Object.assign(this.editInfo, this.basicInfo);
        this.isEdit = false;
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
    getTotle(){
        this.service.id = this.id;
        this.service.isActive = true;
        const url = `api/customer/detail/?id=${this.id}`;
        const totleUrl = `${environment.sellerCRMApi}${url}`;
        this.sub3 = this.auth.get(totleUrl).subscribe((res) => {
            const result = res.json();
            result.customerBaseInfo.industryCategoryFirstId = parseInt(result.customerBaseInfo.industryCategoryFirstId);
            this.getSubCategoryName(result.customerBaseInfo.industryCategoryFirstId);
            result.customerBaseInfo.industryCategorySecondId = parseInt(result.customerBaseInfo.industryCategorySecondId);
            this.basicInfo = result.customerBaseInfo;
            Object.assign(this.editInfo, this.basicInfo);
            console.log(this.editInfo);
        })

    }
    ngOnInit() {
        this.getCategoryName();
        this.id = +this.route.snapshot.params['id'];
        this.getTotle();
        this.auth.get(`${environment.sellerCRMApi}api/Cert/GetAptitudeInformation/?sellerSubjectId=${this.id}`).subscribe((res) => {
            const result = res.json();
            if (result.length !== 0) {
                this.aptIsNew = false;
            } else {
                this.aptIsNew = true;
            }
            this.aptData = result;
        })
        // 证照列表
        this.sub5 = this.auth.get(`${environment.sellerCRMApi}api/Cert/GetCertificatesInformation/?sellerSubjectId=${this.id}`)
            .subscribe((res) => {
                console.log(res.json());
                const result = res.json();
                if (result.length !== 0) {
                    this.licenseIsNew = false;
                } else {
                    this.licenseIsNew = true;
                }
                this.licenseData = res.json()[0];
            })
    }
    public onStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.contractService.query(state);
    }

    closeContactDialog() {
        this.active = false;
    }
    addHandler() {
        this.editForm.reset(new Product());
        this.isNew = true;
        this.active = true;
    }
    public editHandler({ dataItem }) {
        this.isNew = false;
        this.active = true;
        this.editForm.reset(dataItem);
    }
    removeHandler({ dataItem }) {
        this.sub6 = this.auth.post(`${environment.sellerCRMApi}api/Customer/RemoveCustomerContacts`, { 'id': dataItem.id })
            .subscribe((res) => {
                const result = res.json();
                if (result.return_code === 'SUCCESS') {
                    this.state = { skip: 0, take: 5 };
                    this.contractService.query(this.state);
                }
            })
    }
    onContactDialogSave() {
        if(!this.editForm.valid)return;
        const postData = this.editForm.value;
        postData.SellerSubjectId = this.route.snapshot.params['id'];
        this.sub7 = this.auth.post(`${environment.sellerCRMApi}api/Customer/ModifyCustomerContacts`, postData)
            .subscribe((res) => {
                const result = res.json();
                if (result.return_code === 'SUCCESS') {
                    this.active = false;
                    this.state = { skip: 0, take: 5 };
                    this.contractService.query(this.state);
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
        if (this.sub7 !== undefined && this.sub7 !== null) { this.sub7.unsubscribe(); }
    }
}
