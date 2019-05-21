import { Input, Component, Output, EventEmitter, ViewEncapsulation, Injectable, OnInit,OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { AuthHttpService } from '../../+common/services/auth-http.service';
import { AuthService } from '../../+common/services/auth.service';
import { Observable } from 'rxjs/Rx';
import { State } from '@progress/kendo-data-query';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


import {
	FormGroup,
	FormControl
} from '@angular/forms';

import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';

declare var $: any;
declare var kendo: any;

@Component({
	encapsulation: ViewEncapsulation.None,
	selector: 'staffmanagement',
	templateUrl: './staffmanagement.html',
	styleUrls: ['./staffmanagement.scss']
})

export class staffmanagement implements OnDestroy {
    sub1;sub2;sub3;sub4;sub5;
	a:boolean=false;
    opened: boolean = false;
    b:boolean=false;
    add:boolean=false;
    public view: Observable<GridDataResult>;
     public state: State = {
        skip: 0,
        take: 5
    };



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
        debugger;
        __this.authService.AuthPost(`${environment.sellerUserProfileApi}api/Operator/UpdateOperator`,

        this.sub2=__this.resetModel).subscribe(function (res) {

        __this.refresh();

        });
    }

//添加员工
    addyg(e) {
        e.preventDefault();

        let __this = this;

        __this.addModule.fullName = __this.addForm.value["fullName"];
        __this.addModule.userName = __this.addForm.value["userName"];
        __this.addModule.newPassword = __this.addForm.value["newPassword"];

        this.sub3=__this.authService.AuthPost(`${environment.sellerUserProfileApi}api/Operator/AddOperator`,

            __this.addModule).subscribe(function (res) {

        __this.refresh();

            window.location.href = "/enterprisesset/staffmanagement";


        });
    }




    // 添加弹框
    addy(e){
        e.preventDefault();
        this.add = true;

    }




 //更改状态enabledUpdat

 	statu(e) {
        e.preventDefault();

        let __this = this;

        this.sub4=__this.authService.AuthPost(`${environment.sellerUserProfileApi}api/Operator/UpdateOperator`,

            __this.statusModule).subscribe(function (res) {

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
        fullName: new FormControl(),
        userName: new FormControl(),
        newPassword: new FormControl(),
        });
//構建model
    bidAmountModel = {
    	userName:"",
        fullName:"",
        id: 0,
        newPassword:"",
    	enabledUpdat:"",

    	};
	resetModel={
		userName:"",
        fullName:"",
        id: 0,
        newPassword:"",
    	enabledUpdat:"",

	 };
	addModule={
		userName:"",
        fullName:"",
        id: 0,
        newPassword:"",

    };
    statusModule = {
        userName: "",
        fullName: "",
        id: 0,
        lockIt: null,
    };

	constructor(private authService: AuthService, private http: Http) { }
	public datas = {};

 filterTitleRead() {
        var filter = new Array();
        var content = $('#content').val();
        var grid = $('#grid').data("kendoGrid");
        if ($.trim(content) != '') {
            filter.push({ field: "fullName", operator: "contains", value: content });
        }
        grid.dataSource.filter(filter);

         $('#grid').data('kendoGrid').dataSource.read();

     }

	ngOnInit() {
        $.showSide(11002);
		var __this = this;

		var products = [];



		$("#grid").kendoGrid({
			dataSource: {
				transport: {
					read: function (f) {
						var paras = new RequestOptions();
						let url = `api/Operator/GetOperatorList`;
						let totalurl = `${environment.sellerUserProfileApi}${url}`;

						this.sub5=__this.authService.AuthGet(totalurl).subscribe((res) => {
							let result = res.json();
							this.datas = result.data;
							f.success(result);

                            });

                        }

                    },
                    pageSize:20,
                    // serverPaging: true,
                    // serverFiltering: true,
                    // serverSorting: true
                   },
		            pageable: {
                    pageSizes: true,
                    buttonCount: 5
                    },

               columns: [
                   { field: 'roleId', hidden: true },
                   /*{ field: "id", title: "全选", width: "150px", template: '<input type="checkbox">' },*/
                   { field: "fullName", title: "姓名",},
                   { field: "userName", title:"用户名"},
                   { field: "rolesDisplay",title:"角色", },
                   { field: "enabledUpdate", title:"状态", },
			       { command: [{name: "edit1", text: "编辑",class:'edit1',
                                click:function (e, d) {
        							e.preventDefault();
        							var item = this.dataItem($(e.currentTarget).closest("tr"));
                                    __this.bidAmountModel.id = item.id;
        							__this.bidAmountModel.userName = item.userName;
        							__this.bidAmountModel.fullName = item.fullName;
        							__this.opened = true;
                                    }
        	                   },
    	                        {
                                    name:"reset",text:"重置密码",
            	                    click:function (e, d) {
                                            e.preventDefault();
                                            var item = this.dataItem($(e.currentTarget).closest("tr"));
                                            __this.resetModel.id = item.id;
                                            __this.resetModel.userName = item.userName;
                                            __this.resetModel.newPassword = item.newPassword;
                                            __this.a= true;
                                        }
        	                    },
                                {
                                    name: "statu", text: "更改状态",
    	                              click:function (e, d) {
                                            e.preventDefault();
                                            var item = this.dataItem($(e.currentTarget).closest("tr"));
                                            __this.statusModule.id = item.id;
                                            __this.statusModule.userName = item.userName;
                                            if (item.lockoutEnabled) {
                                                __this.statusModule.lockIt = false;
                                            } else {
                                                __this.statusModule.lockIt = true;
                                            }
                                            __this.b= true;
                                        }
	                                }
                    ], title: "操作", width: "250px" }],
                    editable:"popup",
            });

 	  }
        ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
        if (this.sub3 !== undefined && this.sub3 !== null) { this.sub3.unsubscribe();}
        if (this.sub4 !== undefined && this.sub4 !== null) { this.sub4.unsubscribe();}
        if (this.sub5 !== undefined && this.sub5 !== null) { this.sub5.unsubscribe();}
    }
}