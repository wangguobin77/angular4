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
    selector: 'enterpriseannouncement',
    templateUrl: './enterpriseannouncement.html',
    styleUrls: ['./enterpriseannouncement.scss']
})


export class enterpriseannouncement implements OnDestroy{
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

        this.sub1=__this.authService.AuthPost(`${environment.sellerCRMApi}api/SellerAnnouncements/DeleteAnnouncement`,

            __this.delModel).subscribe(function (res) {

                __this.refresh();
                window.location.href = "/enterprisesset/enterpriseannouncement";



            });
    }


    //form构造
    passForm: FormGroup = new FormGroup({
        id: new FormControl(),
    });

    //构造model
    delModel = {
        id: 0,
    };



    constructor(private router: Router, private authService: AuthService, private http: Http) { }
    public datas = {};



    ngOnInit() {
        $.showSide(11005);
        let __this = this;
        var products = [];

        var data = [
            { text: "Black", value: "1" },
            { text: "Orange", value: "2" },
            { text: "Grey", value: "3" }
        ];




        $(function () {
            //格式化成年-月-日
            function formateDate(da) {
                let year = da.getUTCFullYear();
                let mth = getFormatDate(da.getUTCMonth() + 1);
                let day = getFormatDate(da.getUTCDate());

                return `${year}-${mth}-${day}`;
            }


            // 日期，在原有日期基础上，增加days天数，默认增加1天
            function addDate(d, days) {
                if (days == undefined || days == '') {
                    days = 1;
                }
                let date = new Date(d);
                date.setDate(date.getDate() + days);
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let test = date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day)
                return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day);
            }

            // 日期月份/天的显示，如果是1位数，则在前面加上'0'
            function getFormatDate(arg) {
                if (arg == undefined || arg == '') {
                    return '';
                }
                var re = arg + '';
                if (re.length < 2) {
                    re = '0' + re;
                }
                return re;
            }


            //输入时间格式：yyyy-MM-dd
            function convertDateFromString(dateStr) {
                if (dateStr == "" || dateStr == undefined) {
                    return new Date();
                }
                let dtArr = dateStr.split('-');
                let dtY = parseInt(dtArr[0]);
                let dtM = parseInt(dtArr[1]) - 1;
                let dtD = parseInt(dtArr[2]);
                let test = new Date(dtY, dtM, dtD);
                return new Date(dtY, dtM, dtD);
            }
            let now = formateDate(new Date());
            let tomor = addDate(new Date(), 1);
            $("#start").attr("max", now);
            $("#end").attr("min", tomor);
            $("#start").on("blur", function () {

                let currentVal = $("#start").val();
                if (currentVal != "" && currentVal != undefined) {
                    let tt = addDate(convertDateFromString(currentVal), 1);
                    $("#end").attr("min", tt);
                }
            })
            $("#end").on("blur", function () {

                let currentVal = $("#end").val();
                if (currentVal != "" && currentVal != undefined) {
                    let tt = addDate(convertDateFromString(currentVal), -1);
                    $("#start").attr("max", tt);
                }
            })

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
                pageSizes: true,
                buttonCount: 5
            },
            columns: [
                //{ field: "id", title: "id"},
                { field: "title", title: "标题", width: "40%" },
                { field: "formatPublishDate", title: "发布时间", width: "20%" },
                { field: "publishUserName", title: "发布人", width: "20%" },
                {
                    command: [

                        {
                            name: "edit", title: "编辑", editable: "false",
                            click: function (e) {
                                e.preventDefault();
                                var item = this.dataItem($(e.currentTarget).closest("tr"));
                                window.location.href = "enterprisesset/editenterpriseannouncement/" + item.id;
                            }
                        },

                        {
                            name: "del", text: "删除",
                            click: function (e, d) {

                                e.preventDefault();
                                var item = this.dataItem($(e.currentTarget).closest("tr"));

                                __this.delModel.id = item.id;

                                var delid = item.id;
                                console.log(delid);
                                __this.a = true;
                                //__this.refresh();
                            }

                               }, 
                    { name: "查看", title: "search",editable:"false",
                        click:function(e){
                            e.preventDefault();
                            var item = this.dataItem($(e.currentTarget).closest("tr"));
                            window.location.href = "enterprisesset/detailenter/" + item.id;
                        } 
                    },
                    ], title: "操作", width: "25%"
                }], //editable:"popup",
        });



        //search
        $("#btnSearch").click(function () {
            var filter = new Array();
            var titleKey = $("#txtTitleKeyWord").val();
            var datepickerStart = $("#start").val()
            var datepickerEnd = $("#end").val()
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