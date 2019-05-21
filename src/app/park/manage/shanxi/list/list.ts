import { Component, ViewEncapsulation,OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../../list.service';
import { AuthHttpService } from '../../../../+common/services/auth-http.service';
import { environment } from '../../../../../environments/environment';
declare var $: any;

import { State } from '@progress/kendo-data-query';

import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';


@Component({
    // encapsulation: ViewEncapsulation.None,
    selector: 'anhui-client-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.scss']
})


export class List implements OnDestroy {
    sub1;sub2;
    private filtrateBoxIsSHow: boolean = false;
    public view: Observable<GridDataResult>;
    public state: State = {
        skip: 0,
        take: 5
    };
    constructor(public service: DataService, private auth: AuthHttpService) {
        this.view = service;
        console.log(service)
        this.service.query(this.state);
    }
    public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.service.query(state);
    }
    public listItems: Array<string> = ["Baseball", "Basketball", "Cricket", "Field Hockey", "Football", "Table Tennis", "Tennis", "Volleyball"];

    public value = ['Basketball', 'Cricket']

    //条件查询
    public provincePlaceHolder: { name: string, code: string } = { name: "所在省/直辖市", code: null };
    public citiesPlaceHolder: { name: string, code: string } = { name: "所在市/区", code: null };
    public powerUsedTypePlaceHolder = { text: "请选择用电类型", value: null };
    public saleInfoPlaceHolder = { text: "请选择销售信息", value: null };
    public PowerContractPlaceHolder = { text: "请选择供电合约", value: null };
    public CustomerLevelPlaceHolder = { text: "请选择客户等级", value: null };
    public ProgressPercentPlaceHolder = { text: "请选择销售进展", value: null };
    private province: Array<{ name: string, code: number }> = [];
    private cities: Array<{ name: string, code: number }> = [];



    public powerUsedType: Array<{ text: string, value: number }> = [
        { text: "一般工商业用电", value: 2 },
        { text: "大工业用电", value: 1 },
        { text: "农业生产用电", value: 4 },
        { text: "居民生活用电", value: 3 }
    ];
    public saleInfo: Array<{ text: string, value: number }> = [
        { text: "已分配销售员", value: 1 },
        { text: "未分配销售员", value: 2 }
    ];
    public PowerContract: Array<{ text: string, value: number }> = [
        { text: "有", value: 1 },
        { text: "无", value: 2 }
    ];
    public CustomerLevel: Array<{ text: string, value: number }> = [
        { text: "关键客户", value: 1 },
        { text: "主要客户", value: 2 },
        { text: "普通客户", value: 3 }
    ];
    public ProgressPercent: Array<{ text: string, value: number }> = [
        { text: "0%", value: 1 },
        { text: "20%", value: 2 },
        { text: "40%", value: 3 },
        { text: "60%", value: 4 },
        { text: "80%", value: 5 },
        { text: "100%", value: 6 }
    ];



    getProvince() {
        let getProvinceUrl = `${environment.sellerCRMApi}api/Customer/GetProvince`;
        this.sub1=this.auth.get(getProvinceUrl).subscribe((res) => {
            let result = res.json();
            this.province = result;
        });
    }
    provinceChange(e) {
        this.cities = [];
        this.filters.provinceCode = e.code;
        this.getCities(e.code);

    }
    getCities(provinceCode) {
        let citiesUrl = `${environment.sellerCRMApi}api/Customer/GetCities/?parentCode=${provinceCode}`;
        this.sub2=this.auth.get(citiesUrl).subscribe((res) => {
            let result = res.json();
            this.cities = result;
        });
    }
    citiesChange(e) {
        this.filters.citiesCode = e.code;
    }
    powerUsedTypeChange(e) {
        this.filters.UsedPowerType = e.value;
    }
    saleInfoChange(e) {
        this.filters.saleInfo = e.value;
    }
    PowerContractChange(e) {
        this.filters.PowerContract = e.value;
    }
    CustomerLevelChange(e) {
        this.filters.CustomerLevel = e.value;
    }
    ProgressPercentChange(e) {
        this.filters.ProgressPercent = e.text;
    }
    filters = {
        provinceCode: null,
        citiesCode: null,
        UsedPowerType: null,
        saleInfo: null,
        PowerContract: null,
        CustomerLevel: null,
        ProgressPercent: null
    }
    conditionSearch() {
        this.service.filters = '';
        for (let i in this.filters) {
            if (this.filters[i] != null) {
                this.service.filters += `&${i}=${this.filters[i]}`;
            }
        }
        this.service.query(this.state);
    }
    ngOnInit() {
        this.getProvince();
        $.showSide(10104);
    }
    showFiltrateBox() {
        this.filtrateBoxIsSHow = !this.filtrateBoxIsSHow;
    }
    searchClient(e) {
         
        if (e !== "") {
            e = e.replace(/(?:^\s+)|(?:\s+$)/g, '');
            if (e.match(/^([\w]|[\u4e00-\u9fa5])+$/g) != null) {
                this.service.searchBoxContent = `&SellerSubjectName=${e}`;
            }
        } else {
            this.service.searchBoxContent = "";
        }
        this.service.query(this.state);
    }
        ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
    }
}