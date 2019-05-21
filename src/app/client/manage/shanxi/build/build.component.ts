import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import { environment } from '../../../../../environments/environment';
import { Router ,ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
declare var $: any;
@Component({
    selector: 'shanxi-cilent-build',
    templateUrl: './build.component.html',
    styleUrls: ['./build.scss']
})


export class AnhuiBuild implements OnInit, OnDestroy {
    ngAfterViewInit(){
        $.showSide(10101);
    }
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
    goBack(){
        this.location.back();
    }
    private province: Array<{ name: string, code: number }> = [];
    private cities: Array<{ name: string, code: number }> = [];
    public categoryNameForm: { categoryName: string, id: number };
    sub1;
    sub2;
    sub3;
    sub4;
    sub5;
    sub6;
    sub7;

    public sendData = {
        'UsedPowerType': '',
        'SaleUserId': null,
        'SubjectName': '',
        'IndustryCategoryFirstId': null,
        'IndustryCategorySecondId': null,
        'Province': 140000,
        'City': null,
        'ElectricityAmount': '',
        'LegalPerson': '',
        'RegisterManagePlace': '',
        'Address': '',
        'VoltageLevel': '',
        'Capacitance': '',
        'TransformerCapability': '',
        'IsPack': 0,
        'SellerParkId': null
    };
    IsPack: true;
    packChange(m){
        this.IsPack = m;
    }
    public SaleUserData: Array<{ fullName: string, id: string }> = [];
    // 园区
    SellerParkData = [];
    SellerParkDataPlaceHolder = { text: '请选择园区', value: null };
    public TrandingCenterData: Array<{ text: string, value: number }> = [
        { text: '山西交易中心', value: 1 }
    ];
    radioChecked = true;
    opened = false;
    id:number;
    constructor(public auth: AuthHttpService, private http: Http, private router: Router,private route:ActivatedRoute,private location:Location) { 
        this.id = this.route.snapshot.params['id'];
    }
    getCategoryName() {
        const getCategoryNameUrl = `${environment.sellerCRMApi}api/CustomerSX/GetCategoryFirst/`;
        this.sub1 = this.auth.get(getCategoryNameUrl).subscribe((res) => {
            const result = res.json();
            this.CategoryName = result;
        })
    }
    getSubCategoryName(categoryNameId) {
        const getCategoryNameUrl = `${environment.sellerCRMApi}api/CustomerSX/GetCategorySecond/?parentId=${categoryNameId}`;
        this.sub2 = this.auth.get(getCategoryNameUrl).subscribe((res) => {
            const result = res.json();
            this.subCategoryName = result;
        });
    }
    categoryNameChange(e) {
        this.subCategoryName = [];
        this.getSubCategoryName(e);
    }
    getProvince() {
        const getProvinceUrl = `${environment.sellerCRMApi}api/CustomerSX/GetProvince`;
        this.sub3 = this.auth.get(getProvinceUrl).subscribe((res) => {
            const result = res.json();
            this.province = result;
        });
    }
    getCities(provinceCode) {
        const citiesUrl = `${environment.sellerCRMApi}api/CustomerSX/GetCities/?parentCode=${provinceCode}`;
        this.sub4 = this.auth.get(citiesUrl).subscribe((res) => {
            const result = res.json();
            this.cities = result;
        });
    }
    onNext(e, m) {

        this.isNext = true;
    }
    sendTotleData() {
        const data = this.sendData;
        if (!this.radioChecked) {
            delete data.IsPack;
            delete data.SellerParkId;
        } else {
            if (this.IsPack) {
                data.IsPack = 0;
            } else {
                data.IsPack = 1;
            }
        }

        const totleUrl = `${environment.sellerCRMApi}api/CustomerSX/CreateCustomerforApi/`;
        // this.auth.post(totleUrl,this.sendData).subscribe((res)=>{
        // 	let result=res.json();
        // 	console.log(result);
        // })
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });

        this.sub5 = this.auth.post(totleUrl, data).subscribe((res) => {
            const result = res.json();
            console.log(result);
            if (result.return_code === 'SUCCESS') {
                this.opened = true;
            }
        })
    }
    onSubmit(e) {
        this.sendTotleData();
    };
    skip() {
        this.sendTotleData();
    }



    getSaleUser() {
        const citiesUrl = `${environment.sellerCRMApi}api/CustomerSX/GetSalesList`;
        this.sub6 = this.auth.get(citiesUrl).subscribe((res) => {
            const result = res.json();
            this.SaleUserData = result;
        });
    }
    radioChange(n: boolean) {
        this.radioChecked = n;
    }
    close() {
        this.opened = false;
    }
    ngOnInit() {
        this.getCategoryName();
        this.getProvince();
        this.getSaleUser();
        this.getCities(140000)
        this.sub7 = this.auth.get(`${environment.sellerCRMApi}api/CustomerSX/GetCurrentSellerSellerParkList`)
            .subscribe((res) => {
                this.SellerParkData = res.json();
                debugger;
                this.sendData.SellerParkId = parseInt(this.route.snapshot.params['id']);
            });
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
