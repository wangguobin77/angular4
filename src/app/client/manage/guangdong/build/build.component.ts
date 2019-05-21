import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import {
    FormGroup,
    FormControl
} from '@angular/forms';
declare var $: any;
@Component({
    selector: 'guangdong-cilent-build',
    templateUrl: './build.component.html',
    styleUrls: ['./build.scss']
})


export class GuangdongBuild implements OnInit, OnDestroy {
    ngAfterViewInit(){
        $.showSide(10101);
    }
    opened = false;
    public SaleUserData: Array<{ fullName: string, id: string }> = [];

    isNext = false;
    public CategoryName: Array<{ categoryName: string, id: number }> = [];
    public subCategoryName: Array<{ categoryName: string, id: number }> = [];
    public powerUsedTypePlaceHolder = { text: '请选择用电类型', value: null };
    public placeHolder: { categoryName: string, id: number } = { categoryName: '选择用电客户行业类别', id: null };
    public provincePlaceHolder: { name: string, code: string } = { name: '用电主体所在省/直辖市', code: null };
    public citiesPlaceHolder: { name: string, code: string } = { name: '所在市/区', code: null };
    public powerUsedType: Array<{ text: string, value: number }> = [
        { text: '大工业用电', value: 1},
        { text: '一般工商业用电', value: 2},
        { text: '居民生活用电', value: 3},
        { text: '农业生产用电', value: 4}
    ];
    //电压等级
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
    private province: Array<{ name: string, code: number }> = [];
    private cities: Array<{ name: string, code: number }> = [];
    public categoryNameForm: { categoryName: string, id: number };
    public buildFirstForm: FormGroup = new FormGroup({
        IndustryCategoryFirstId: new FormControl(),
        UsedPowerType: new FormControl(),
        // categoryNameForm: new FormControl(),
        IndustryCategorySecondId: new FormControl(),
        Province: new FormControl(),
        City: new FormControl(),
        SubjectName: new FormControl(),
        ElectricityAmount: new FormControl()
    });

    public sendData = {
        'UsedPowerType': '',
        'SaleUserId': null,
        'SubjectName': '',
        'IndustryCategoryFirstId': '',
        'IndustryCategorySecondId': '',
        'Province': '440000',
        'City': '',
        'ElectricityAmount': '',
        'ProvinceCode': '',
        'LegalPerson': '',
        'RegisterManagePlace': '',
        'Address': '',
        'VoltageLevel': '',
        'Capacitance': '',
        'TransformerCapability': ''
    };
    secondFormData = {
        'SaleUserId':null,
        'LegalPerson':'',
        'RegisterManagePlace':'',
        'Address':'',
        'VoltageLevel':'',
        'Capacitance':'',
        'TransformerCapability':''
    }

    sub1;
    sub2;
    sub3;
    sub4;
    sub5;

    constructor(public auth: AuthHttpService, private http: Http, private router: Router) { }
    getCities(provinceCode) {
        const citiesUrl = `${environment.sellerCRMApi}api/Customer/GetCities/?parentCode=${provinceCode}`;
        this.sub1 = this.auth.get(citiesUrl).subscribe((res) => {
            const result = res.json();
            this.cities = result;
        });
    }
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
    onNext(e) {
        this.isNext = true;
    }
    sendTotleData() {
        for(let k in this.buildFirstForm.value){
            this.sendData[k] = this.buildFirstForm.value[k];
        }
        const totleUrl = `${environment.sellerCRMApi}api/CustomerGD/CreateCustomerforApi/`;

        this.sub4 = this.auth.post(totleUrl, this.sendData)
            .subscribe((res) => {
                const result = res.json();
                console.log(result);
                if (result.return_code === 'SUCCESS') {
                    this.opened = true;
                }
            })
    }
    onSubmit(e) {
        for(let k in this.secondFormData){
            this.sendData[k] = this.secondFormData[k];
        }
        this.sendTotleData();
    };
    skip() {
        this.sendTotleData();
    }
    close() {
        this.opened = false;
    }
    getSaleUser() {
        const citiesUrl = `${environment.sellerCRMApi}api/CustomerGD/GetSalesList`;
        this.sub5 = this.auth.get(citiesUrl).subscribe((res) => {
            const result = res.json();
            this.SaleUserData = result;
        });
    }

    ngOnInit() {
        this.getCategoryName();
        this.getCities(440000);
        this.getSaleUser();

    }
    ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe(); }
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe(); }
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe(); }
        if (this.sub4 !== undefined && this.sub4 !== null) { this.sub4.unsubscribe(); }
        if (this.sub5 !== undefined && this.sub5 !== null) { this.sub5.unsubscribe(); }
    }
}
