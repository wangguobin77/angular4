import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { AuthHttpService } from '../../../../../+common/services/auth-http.service';
import { environment } from '../../../../../../environments/environment';
import { DetailService } from '../detail.service';
import { ClientService } from './park.service';
import { ParkClientService } from './parkcustomer.service';
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
    selector: 'park',
    templateUrl: './park.component.html',
    styleUrls: ['./park.scss']
})
export class Park {
    public id: number;
    public basicInfo = {};
    public editInfo = {};
    public isEdit: boolean = false;
    private headers = new Headers({ 'Content-Type': 'application/json' });
    public cities: Array<string> = [];
    public activate = new EventEmitter<string>();
    constructor(
        public auth: AuthHttpService,
        public route: ActivatedRoute,
        public http: Http,
        public service: DetailService,
        public parkcustomer: ParkClientService,
        private contractService: ClientService
    ) {
        service.setActive('park');

        //联系人列表
        contractService.SellerSubjectID = route.snapshot.params["id"];
        this.view = contractService;
        this.contractService.query(this.state);
        //园区客户列表
        parkcustomer.sellerParkId = route.snapshot.params["id"];
        this.customerview = parkcustomer;
        let k = this.parkcustomer.query(this.customerstate);
        
    }
    public resa: any;
    CategoryNameReady: boolean = false;
    baseInEdit() {
        //加载地区信息
        if (!this.CategoryNameReady) {
            let citiesUrl = `${environment.sellerCRMApi}api/Customer/GetCities/?parentCode=140000`;
            this.auth.get(citiesUrl).subscribe((res) => {
                let result = res.json();
                this.cities = result;
            });
        }
        this.isEdit = true;
    }
    submitBaseInfo() {
        let clientUrl = `${environment.sellerCRMApi}api/SellerPark/ModifySellerPark/`;
        this.auth
            .post(clientUrl, this.editInfo).subscribe((res) => {
                if (res.json().return_code == "SUCCESS") {
                    this.getData();
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

    private aptData = [];
    private aptIsNew: boolean = true;
    private licenseData = [];
    private licenseIsNew: boolean = true;
    getData(){
        let url = `api/SellerPark/GetSellerParkDetail/?id=${this.id}`;
        let totleUrl = `${environment.sellerCRMApi}${url}`;
        this.auth.get(totleUrl).subscribe((res) => {
            let result = res.json();
            result.createDate = result.createDate.replace("-", ".").replace("-", ".");
            this.basicInfo = result;
            Object.assign(this.editInfo, this.basicInfo);
            console.log(this.basicInfo);
        })
    }
    ngOnInit() {
        $.showSide(10104);
        this.id = +this.route.snapshot.params['id'];
        this.service.id = this.id;
        this.service.isActive = true;
        this.getData();
    }

    public view: Observable<GridDataResult>;
    public state: State = {
        skip: 0,
        take: 5
    };
    public onStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.contractService.query(state);
    }
    //园区客户
    public customerview: Observable<GridDataResult>;
    public customerstate: State = {
        skip: 0,
        take: 5
    };
    public onCustomerChange(state: DataStateChangeEvent): void {
        this.customerstate = state;
        this.parkcustomer.query(state);
    }

    private editForm = new FormGroup({
        'id': new FormControl(),
        'contacts': new FormControl("", Validators.required),
        'position': new FormControl(),
        'tel': new FormControl("", Validators.required),
        'remark': new FormControl()
    });
    private isNew = false;
    private active: boolean = false;
    closeContactDialog() {
        this.active = false;
    }
    addHandler() {
        this.editForm.reset(new Product());
        this.isNew = true;
        this.active = true;
    }
    public editHandler({dataItem}) {
        this.isNew = false;
        this.active = true;
        this.editForm.reset(dataItem);
    }
    removeHandler({dataItem}) {
        this.auth.post(`${environment.sellerCRMApi}api/SellerPark/DeleteParkContacts`, { "id": dataItem.id }).subscribe((res) => {
            let result = res.json();
            if (result.return_code == "SUCCESS") {
                this.state = { skip: 0, take: 5 };
                this.contractService.query(this.state);
            }
        })
    }
    onContactDialogSave() {
        if(!this.editForm.valid)return;
        let postData = this.editForm.value;
        postData.SellerParkId = this.route.snapshot.params["id"];
        this.auth.post(`${environment.sellerCRMApi}api/SellerPark/ModifyParkContacts`, postData).subscribe((res) => {
            let result = res.json();
            if (result.return_code == "SUCCESS") {
                this.active = false;
                this.state = { skip: 0, take: 5 };
                this.contractService.query(this.state);
            }
        })
    }
}