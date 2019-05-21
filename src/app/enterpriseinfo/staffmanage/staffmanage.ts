import { Input, Component, Output, EventEmitter, ViewEncapsulation, Injectable, OnInit,OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { AuthHttpService } from '../../+common/services/auth-http.service';
import { AuthService } from '../../+common/services/auth.service';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


import {
	FormGroup,
	FormControl
} from '@angular/forms';



declare var $: any;
declare var kendo: any;

@Component({
	encapsulation: ViewEncapsulation.None,
	selector: 'staffmanage',
	templateUrl: './staffmanage.html',
	styleUrls: ['./staffmanage.scss']
})

export class staffmanage implements OnDestroy{
    sub1;sub2;sub3;sub4;
	a:boolean=false;
    opened: boolean = false;
    b:boolean=false;
    add:boolean=false;



    close(v) {
        this.opened = false;
        this.a=false;
        this.b = false;
        this.add=false;
    }
    
    refresh() {
     	this.a = false;
     	this.b = false;
        this.opened = false;
        this.add=false;
        $("#grid").data("kendoGrid").dataSource.filter("");
    }

//编辑post
    submit(e) {
        e.preventDefault();

        let __this = this;
     
		// 
        __this.bidAmountModel.fullName = __this.passForm.value["fullName"];

        __this.authService.AuthPost(`${environment.sellerUserProfileApi}api/Operator/UpdateOperator`,

        this.sub1=__this.bidAmountModel).subscribe(function (res) {
        
        __this.refresh();

        });
    }




   //提交重置密码resetModel

	reset(e) {
        e.preventDefault();

        let __this = this;
      
        __this.resetModel.newPassword = __this.mmForm.value["newPassword"];

        __this.authService.AuthPost(`${environment.sellerUserProfileApi}api/Operator/UpdateOperator`,

        this.sub2=__this.resetModel).subscribe(function (res) {
        
        __this.refresh();

        });
    }





 //更改状态enabledUpdat

 	statu(e) {
        e.preventDefault();

        let __this = this;
      
        __this.bidAmountModel.enabledUpdat= __this.statuForm.value["enabledUpdat"];

        __this.authService.AuthPost(`${environment.sellerUserProfileApi}api/Operator/UpdateOperator`,

        this.sub3=__this.bidAmountModel).subscribe(function (res) {
        
        __this.refresh();

        });
    }



//form构造
    passForm: FormGroup = new FormGroup({
        fullName: new FormControl(),
        newPassword:new FormControl(),
        enabledUpdat:new FormControl(),
    });

    mmForm: FormGroup = new FormGroup({
        newPassword:new FormControl(),
 
     });
    statuForm: FormGroup = new FormGroup({
        enabledUpdat:new FormControl(),
      });
    addForm: FormGroup = new FormGroup({
        addName: new FormControl(),

        });
//構建model
    bidAmountModel = {
    	userName:"string",
        fullName:"string",
        id: 0,
        newPassword:"string",
    	enabledUpdat:"string",
       
    	};
	resetModel={
		userName:"string",
        fullName:"string",
        id: 0,
        newPassword:"string",
    	enabledUpdat:"string",

	 };
	addModule={
		userName:"string",
        fullName:"string",
        id: 0,
        newPassword:"string",

	 };
	@Input()
    public whichIsActive: string;
    public menuList = [
        {
            "name": "sellerinfo",
            "text": "企业信息",
            "url": "/enterpriseinfo/sellerinfo",
            "icon": "iconfont icon-qiyexinxi",
            "isActive": false,
            "isNew": false
        },
        {
            "name": "staffmanage",
            "text": "员工管理",
            "url": "/enterpriseinfo/staffmanage",
            "icon": "iconfont icon-kehuguanli",
            "isActive": false,
            "isNew": false
        },
        {
            "name": "staff",
            "text": "角色管理",
            "url": "/enterpriseinfo/staff",
            "icon": "iconfont icon-jiaoseguanli1",
            "isActive": false,
            "isNew": false
        },
        {
            "name": "account",
            "text": "登录日志",
            "url": "/enterpriseinfo/account",
            "icon": "iconfont icon-denglurizhi",
            "isActive": false,
            "isNew": false
        },
        {
            "name": "enterpriseannounce",
            "text": "企业公告",
            "url": "/enterpriseinfo/enterpriseannounce",
            "icon": "iconfont icon-laba",
            "isActive": false,
            "isNew": false
        }
    ]


	constructor(private authService: AuthService, private http: Http) { }
	public datas = {};



	ngOnInit() {

		var __this = this;

		for (let k of this.menuList) {
			if (this.whichIsActive == k.name) {
				k.isActive = true;
			 }
		  };
		var products = [];


		$("#grid").kendoGrid({
			dataSource: {
				transport: {
					read: function (f) {
						var paras = new RequestOptions();
						let url = `api/Operator/GetOperatorList`;
						let totalurl = `${environment.sellerUserProfileApi}${url}`;

						this.sub4=__this.authService.AuthGet(totalurl).subscribe((res) => {
							let result = res.json();
							this.datas = result.data;
							f.success(result);

                            });
                   
                        }

                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true
                   },
		           pageable: true,
		           height: 550,
		           toolbar: [
		              

                      
            		 ],

               columns: [
                   { field: "fullName", title: "姓名",},
                   { field: "userName", title:"用户名"},
                   { field: "rolesDisplay",title:"角色", },
                   { field: "enabledUpdate", title:"状态", }

                   ],

            });

 	  }
       ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe();}
        if (this.sub4 !== undefined && this.sub4 !== null) { this.sub4.unsubscribe();}
    }
}