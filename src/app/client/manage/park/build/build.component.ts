import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import { environment } from '../../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactService } from './contact.service';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { State } from '@progress/kendo-data-query';
import { Product } from './model';
import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';
declare var $: any;
@Component({
    selector: 'anhui-cilent-build',
    templateUrl: './build.component.html',
    styleUrls: ['./build.scss']
})

export class ParkBuild implements OnInit, OnDestroy {
    ngAfterViewInit(){
        $.showSide(10104);
    }
    isNext = false;
    public CategoryName: Array<{ categoryName: string, id: number }> = [];
    public subCategoryName: Array<{ categoryName: string, id: number }> = [];
    public powerUsedTypePlaceHolder = { text: '请选择用电类型', value: null };
    public placeHolder: { categoryName: string, id: number } = { categoryName: '选择用电客户行业类别', id: null };
    public provincePlaceHolder: { name: string, code: string } = { name: '用电主体所在省/直辖市', code: null };
    public citiesPlaceHolder: { name: string, code: string } = { name: '所在市/区', code: null };
    public powerUsedType: Array<{ text: string, value: number }> = [
        { text: '工商业用电', value: 1 },
        { text: '大工业用电', value: 2 },
        { text: '农业生产用电', value: 3 },
        { text: '居民生活用电', value: 4 }
    ];
    sub1;
    sub2;
    sub3;
    sub4;
    sub5;

    private isNew = false;
    private active = false;

    private editForm = new FormGroup({
        'id': new FormControl(),
        'contacts': new FormControl('', Validators.required),
        'position': new FormControl(),
        'tel': new FormControl('', Validators.required),
        'remark': new FormControl()
    });

    public categoryNameForm: { categoryName: string, id: number };
    public SaleUserData: Array<{ fullName: string, id: string }> = [];
    public sellerPark = {
        "id": 0,
        "sellerParkName": "",
        "sellerId": "00000000-0000-0000-0000-000000000000",
        "saleUserId": "",
        "createDate": new Date(),
        "customerNum": "",
        "tradingCenterId": 0,
        "province": "140000",
        "city": null,
        "address": "",
        "operator": "",
        "secretKey": "",
        "transferSaleId": "",
        "customerLevel": 1,
        "progressPercent": 0
    };
    opened = false;
    private province: Array<{ name: string, code: number }> = [];
    private cities: Array<{ name: string, code: number }> = [];
    constructor(public auth: AuthHttpService,
        private http: Http,
        private router: Router,
        private service: ContactService,
        private route: ActivatedRoute) {
    }
    addContact() {
        this.editForm.reset(new Product());
        this.isNew = true;
        this.active = true;
    }

    closeContactDialog() {
        this.active = false;
    }
    index: number;
    public editHandler(dataItem,index) {
        this.isNew = false;
        this.active = true;
        this.index = index;
        this.editForm.reset(dataItem);
    }
    removeHandler(dataItem ) {
        let index = this.parkContacts.indexOf(dataItem);
        this.parkContacts.splice(index,1);
    }
    onContactDialogSave() {
        if(!this.editForm.valid)return;
        if (this.isNew) {
            this.parkContacts.push(this.editForm.value);
        } else {
            this.parkContacts[this.index] = this.editForm.value;
        }
        
        this.active = false;
    }
    getCities(provinceCode) {
        const citiesUrl = `${environment.sellerCRMApi}api/Customer/GetCities/?parentCode=${provinceCode}`;
        this.sub3 = this.auth.get(citiesUrl)
            .subscribe((res) => {
                const result = res.json();
                this.cities = result;
            });
    }

    close() {
        this.opened = false;
    }
    onSubmit(m) {
        debugger;
        if(!m.valid){
            alert('请输入必填信息');
            return;
        }
        let postData = {
            sellerPark:this.sellerPark,
            parkContacts:this.parkContacts
        }
        this.sub2 = this.auth.post(`${environment.sellerCRMApi}api/SellerPark/AddSellerPark/`,postData).subscribe((res)=>{
            if(true){
                this.opened = true;
            }
        })
    };
    skip() {
        this.router.navigate(['/client/park']);
    }
    ngOnInit() {
        this.getCities(140000);
    }
    parkContacts = [];
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe(); }
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe(); }
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe(); }
        if (this.sub4 !== undefined && this.sub4 !== null) { this.sub4.unsubscribe(); }
        if (this.sub5 !== undefined && this.sub5 !== null) { this.sub5.unsubscribe(); }
    }
}
