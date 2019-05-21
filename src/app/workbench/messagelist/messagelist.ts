import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../work.service';
import { Observable } from 'rxjs/Rx';
import { State } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import { AuthService } from '../../+common/services/auth.service';
import { environment } from '../../../environments/environment';
import {
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';
declare var $: any;
@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'messagelist',
    templateUrl: './messagelist.html',
    styleUrls: ['./messagelist.scss']
})
export class messagelist implements OnInit, OnDestroy {
    public view: Observable<GridDataResult>;
    public state: State = {
        skip: 0,
        take: 5
    };

    subscribes: Array<any> = [];
    constructor(private router: Router, private authService: AuthService) {

    }

    ngOnInit() {
        $.showMenu(0);
        let the = this;
        var products = [

        ];
        var data = [
            { text: "请选择", value: "0" },
            { text: "企业公告", value: "1" },
            { text: "系统通知", value: "2" },
            { text: "我的消息", value: "3" }
        ];

        $("#massageTypeSelect").kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: data,
            index: 0
        });



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


        //搜索标题
        // function filterTitleRead() {
        //     var filter = new Array();
        //     var content = $('#content').val();
        //     var grid = $('#grid').data("kendoGrid");
        //     if ($.trim(content) != '') {
        //         filter.push({ field: "Title", operator: "contains", value: content });
        //     }
        //     grid.dataSource.filter(filter);

        //     $('#grid').data('kendoGrid').dataSource.read();

        // }
        $("#iSearch").bind("click", function () {
            var filter = new Array();
            var grid = $("#grid").data("kendoGrid");
            var searchVal = $("#content").val();
            if ($.trim(searchVal) != '')
                filter.push({ field: "title", operator: "contains", value: searchVal });
            grid.dataSource.filter(filter);
        });

        //搜索按钮，搜索类别+时间区域
        function filterDateRead() {
            var filter = new Array();
            var Title = $('#massageTypeSelect').val();
            var startTime = $('#monthpicker').val();
            var endTime = $('#endMonthpicker').val();
            var strs = endTime.split("-");
            var newDay = "";

            //格式化时间，用于选择开始和结束时间一样的情况。由于格式日期为两位，需要分两种情况，例如在09日 +1天。
            if (String(parseInt(strs[2]) + 1).length == 1) {
                newDay = "0" + String((parseInt(strs[2]) + 1))
            } else {
                newDay = String(parseInt(strs[2]) + 1)
            };
            endTime = strs[0] + "-" + strs[1] + "-" + newDay;
            var grid = $('#grid').data("kendoGrid");

            if ($.trim(Title) != '') {
                filter.push({ field: "Type", operator: "eq", value: Title });
            }
            if ($.trim(startTime) != '') {
                filter.push({ field: "publishDate", operator: "gte", value: startTime });
            }
            if ($.trim(endTime) != '') {
                filter.push({ field: "publishDate", operator: "lte", value: endTime });
            }
            grid.dataSource.filter(filter);

            $('#grid').data('kendoGrid').dataSource.read();

        }

        //改变标题自动筛选
        $("#massageTypeSelect").change(function () {
            var filter = new Array();

            var Title = $('#massageTypeSelect').val();
            var grid = $("#grid").data("kendoGrid");
            if ($.trim(Title) != "0" && $.trim(Title) != '') {
                filter.push({ field: "type", operator: "eq", value: Title });
            }
            grid.dataSource.filter(filter);
        });



        $("#grid").kendoGrid({

            dataSource:
            {
                transport: {
                    read: function (f) {
                        the.subscribes.push(the.authService.AuthGet(`${environment.sellerUserProfileApi}api/WorkbenchUser/GetAnnouncements`).subscribe(function (res) {
                            f.success(res.json());
                        }));
                    }
                },
                pageSize: 20
            },

            pageable: {
                pageSizes: true,
                buttonCount: 5
            },
            columns: [
                { field: "titleAndType", title: "标题", width: "300px" },
                { field: "loaclPublishDate", title: "时间", width: "120px", template: "#= kendo.toString(kendo.parseDate(loaclPublishDate), 'yyyy-MM-dd HH:mm') #" },
                { field: "publishUserName", title: "操作人", width: "120px" },
                {

                    template: function(item){
                        return `<i class='iconfont icon-sousuo color-blue'></i><a data-id=${item.id} data-type=${item.type} class='color-blue ma-l10 detail' style="cursor:pointer">查看<a/>`;
                    },
                    field: "id",
                    title: "操作",
                    width: "150px"
                },

                //{ field: "id", title: "操作", width: "150px", template: '<i class="iconfont icon-sousuo color-blue"></i><a  class="color-blue ma-l10">查看</a>' }
            ],
        });


        /*
        查看具体消息详情
         */
        $('#grid').off('click','a.detail').on('click','a.detail',function(){
            let id = $(this).attr('data-id');
            let type = $(this).attr('data-type');

            the.router.navigate([`/messageDetail`,id,type]);
        });
    }


    filterTitleRead() {

        var filter = new Array();
        var titleKey = $("#massageTypeSelect").val();
        var datepickerStart = $("#start").val()
        var datepickerEnd = $("#end").val()
        var gird = $("#grid").data("kendoGrid");
        if ($.trim(titleKey) != "") {
            filter.push({ field: "title", operator: "contains", value: titleKey });
        }
        if ($.trim(datepickerStart) != "") {
            filter.push({ field: "loaclPublishDate", operator: "gte", value: datepickerStart });
        }
        if ($.trim(datepickerEnd) != "") {
            filter.push({ field: "loaclPublishDate", operator: "lte", value: datepickerEnd });
        }
        gird.dataSource.filter(filter);

    }

    ngOnDestroy() {
        this.subscribes.forEach(item => {
            if (item != null) item.unsubscribe();
        });
    }
}
