 import { Input, Component, Output, EventEmitter, ViewEncapsulation, Injectable, OnInit ,OnDestroy} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { State } from '@progress/kendo-data-query';
import { Router, ActivatedRoute } from '@angular/router';

import { DialogModule } from '@progress/kendo-angular-dialog';

import { InputsModule } from '@progress/kendo-angular-inputs';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { AuthHttpService } from '../../+common/services/auth-http.service';

import { AuthService } from '../../+common/services/auth.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';



import {
    FormGroup,
    FormControl
} from '@angular/forms';


declare var $: any;
declare var kendo: any;


@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'enterpriseannounce',
    templateUrl: './enterpriseannounce.html',
    styleUrls: ['./enterpriseannounce.scss']
})


export class enterpriseannounce implements OnDestroy {
    sub1;sub2;
    a: boolean = false;

    close(v) {

        this.a = false;
    }

    refresh() {
        this.a = false;
        $("#grid").data("kendoGrid").dataSource.filter("");
    }


//删除post
    submit(e) {
        e.preventDefault();

        let __this = this;
        
        __this.authService.AuthPost(`${environment.sellerCRMApi}api/SellerAnnouncements/DeleteAnnouncement`,

        this.sub1=__this.delModel).subscribe(function (res) {
        
        __this.refresh();



        });
    }


 //form构造
    passForm:FormGroup = new FormGroup({
        id: new FormControl(),
    });

//构造model
    delModel={
        id:0,
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
    constructor(private router: Router,private authService: AuthService, private http: Http) { }
    public datas = {};

    ngOnInit() {

        let __this=this;
        var products = [];

        var data = [
            { text: "Black", value: "1" },
            { text: "Orange", value: "2" },
            { text: "Grey", value: "3" }
        ];




        $(function () {
            function startChange() {
                var startDate = start.value(),
                    endDate = end.value();

                if (startDate) {
                    startDate = new Date(startDate);
                    startDate.setDate(startDate.getDate());
                    end.min(startDate);
                } else if (endDate) {
                    start.max(new Date(endDate));
                } else {
                    endDate = new Date();
                    start.max(endDate);
                    end.min(endDate);
                }
            }

            function endChange() {
                var endDate = end.value(),
                    startDate = start.value();

                if (endDate) {
                    endDate = new Date(endDate);
                    endDate.setDate(endDate.getDate());
                    start.max(endDate);
                } else if (startDate) {
                    end.min(new Date(startDate));
                } else {
                    endDate = new Date();
                    start.max(endDate);
                    end.min(endDate);
                }
            }

            var start = $("#monthpicker").kendoDatePicker({
                start: "year",
                depth: "year",
                //value: new Date(),
                format: "yyyy MMMM",
                change: startChange
            }).data("kendoDatePicker");

            var end = $("#endMonthpicker").kendoDatePicker({
                start: "year",
                depth: "year",
                //value: new Date(),
                format: "yyyy MMMM",
                change: endChange
            }).data("kendoDatePicker");

            start.max(end.value());
            end.min(start.value());
        });


        $("#grid").kendoGrid({
            dataSource: {
                transport: {
                    read: function (f) {
                        var paras = new RequestOptions();
                        let url = `api/SellerAnnouncements/GetAnnouncementsList?type=1`;
                        let totalurl = `${environment.sellerCRMApi}${url}`;

                        this.sub2=__this.authService.AuthGet(totalurl).subscribe((res) => {
                            let result = res.json();
                            this.datas = result.data;
                            f.success(result);
                            //console.log(this.datas.id)
                            });
                   
                        }

                
                },
                pageSize: 20
            },

            pageable: {
                input: true,
                numeric: false
            },
            columns: [

                { field: "title", title: "标题", width: "40%" },
                { field: "formatPublishDate", title: "发布时间", width: "20%" },
                { field: "publishUserName", title: "发布人", width: "20%" },
                ]
        });



        //search
        $("#btnSearch").click(function () {
            var filter = new Array();
            var titleKey = $("#txtTitleKeyWord").val();
            var datepickerStart = $("#monthpicker").val()
            var datepickerEnd = $("#endMonthpicker").val()
            var gird = $("#grid").data("kendoGrid");
            if ($.trim(titleKey) != "") {
                filter.push({ field: "title", operator: "contains", value: titleKey });
            }
            if ($.trim(datepickerStart) != "") {
                filter.push({ field: "formatPublishDate", operator: "gte", value: datepickerStart });
            }
            if ($.trim(datepickerEnd) != "") {
                filter.push({ field: "formatPublishDate", operator: "lte", value: datepickerEnd });
            }
            gird.dataSource.filter(filter);
        });




    



    }
        ngOnDestroy(): void {
        if (this.sub1 !== undefined && this.sub1 !== null) { this.sub1.unsubscribe();}
        if (this.sub2 !== undefined && this.sub2 !== null) { this.sub2.unsubscribe();}
    }
}