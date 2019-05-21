﻿import { Input, Component, Output, EventEmitter, ViewEncapsulation, Injectable, OnInit } from '@angular/core';


import { Observable } from 'rxjs/Observable';

import { State,CompositeFilterDescriptor } from '@progress/kendo-data-query';

import 'rxjs/add/operator/map';


import { environment } from '../../../../environments/environment';

import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { AuthHttpService } from '../../../+common/services/auth-http.service';

import { AuthService } from '../../../+common/services/auth.service';

import { DataService } from './performancegd.service';

import 'rxjs/add/operator/map';



import 'rxjs/add/operator/catch';

import {

    GridDataResult,

    DataStateChangeEvent

} from '@progress/kendo-angular-grid';



declare var $: any;

declare var kendo: any;

@Component({

    selector: 'Performancegd',

    templateUrl: './performancegd.component.html',

    styleUrls: ['./performance.scss']

})

export class Performancegd{

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
        ContractStatus: [] //状态
    }

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


     //信息的读取

        //let Info = `api/CustomerCountAndAnalysis/GetCustomerCountInfo/`;

        //let totalInfo = `${environment.sellerCRMApi}${Info}`;

        let totalInfo=`${environment.sellerCRMApi}api/CustomerCountAndAnalysisGD/GetCustomerCountInfo`;

        _this.authService.AuthGet(totalInfo).subscribe((res) => {

            let result = res.json();

          _this.data = result;

        });



        $.showSide(10102);


        var products = [];


    function reHeight(){

            $("#tRight").height($("#tLeft").height()+"px");

        }

        reHeight();

        $(window).resize(function(){

            reHeight();

        })


    }



    //search
    searchSub(e) {
        if (e !=='') {
            e = e.replace(/(?:^\s+)|(?:\s+$)/g, '');
            if (e.match(/^([\w]|[\u4e00-\u9fa5])+$/g) != null) {
                this.service.searchBoxContent = `&SubjectName=${e}`;
            }
        } else {
            this.service.searchBoxContent = '';
        }
        this.service.query(this.state);
    }
    checkChange(e) {
        if(e.currentTarget.checked){
            this.filters.ContractStatus.push(e.currentTarget.value);
        }
        else{
            var del = this.filters.ContractStatus.indexOf(e.currentTarget.value);
            this.filters.ContractStatus.splice(del,1);
        }
    }
  conditionSearch() {


        this.service.filters = "";
        for(let k of this.isChecked){
            if(k.boo){
                this.service.filters += k.num;
            }
        }

        // debugger;
        this.service.query(this.state);
    }
    searchReset(){

         $(".filtrate-box input[type='checkbox']").prop("checked", false);

        this.filters.ContractStatus =[];
    }








}