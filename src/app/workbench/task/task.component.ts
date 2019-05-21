import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../+common/services/auth.service';

import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Router,ActivatedRoute } from '@angular/router'

import { environment } from '../../../environments/environment'

declare var $: any;
declare var kendo: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'task',
    templateUrl: './task.html',
    styleUrls: ['./task.scss']
})
export class TaskComponent {
    constructor(private location: Location, private authService: AuthService, private http: Http, private router: Router,private route: ActivatedRoute) {

    }

    share = {
        tcpy: this.authService.currentTradingCenter.pingYin,
        apiCrm: environment.sellerUserProfileApi+'api/',
    };

    model = {
        sellerTaskVMList: [
            {
                id: "65553633-ece1-4174-b47d-291e3a1d4b6f",
                userId: "a37c63e7-f344-4edd-a156-660cd9bcb1b5",
                title: "星期一",
                taskTime: "2017-06-26T00:00:00+08:00",
                sellerSubjectId: null,
                sellerSubjectName: null,
                description: "任务内容",
                taskStatus: 1,
                taskLevel: 0,
                createDate: "2017-06-26T20:15:09.6855454+08:00"
            }
        ],
        today: "2017-06-26T00:00:00",
        day:'',
        month:'',
        formatWeek: "周一"
    };

    vData = {
        timeToString:(date)=>{
            return kendo.toString(kendo.parseDate(date), 'HH:mm');
        }
    };

    taskid=null;
    closeDialog:any=null;
    delDialog:any=null;

    doDel(id){
        this.taskid=id;
        this.delDialog.open();
    }
    doClose(id){
        this.taskid=id;
        this.closeDialog.open();
    }
    doHandler(taskid){
        this.authService.AuthPost(`${this.share.apiCrm}workbenchuser/ModifyTaskStatus/?id=${taskid}&status=2`,null).subscribe(res => {
            let data = res.json();
            if (data.actionResult) {
                $("#" + taskid).find(".icon-duihao").hide();
                $("#" + taskid).find(".ma-r60").attr("class", "float-r ma-r60").text("已处理");
            } else {
                alert("操作失败!");
            }
        });
    }

    ngOnInit() {
        $.showMenu(-1);

        let the = this;

        let date = this.route.snapshot.params['date'];

        the.authService.AuthGet(`${the.share.apiCrm}WorkbenchUser/GetTaskList?date=${date}`).subscribe(res => {
            the.model = res.json();
            let dToday = kendo.parseDate(the.model.today);
            the.model.day = kendo.toString(dToday, "dd");
            the.model.month = kendo.toString(dToday, "yyyy年MM月");
            the.model.today = kendo.toString(dToday, "yyyy年MM月dd日");

            load();
        });

        function load(){
            $("#calendar").kendoCalendar({
                value: new Date(),
                weekNumber: false,
                month: {
                    content: '<div class="task">#= data.value #</div>',
                    weekNumber: '<a class="italic">#= data.weekNumber #</a>'
                },
                footer: false,
                width: '400px',
                navigate: function () {
                    //var tasks = [{ date: "2017/03/14", amount: 3 }, { date: "2017/3/24", amount: 2 }, { date: "2017/2/24", amount: 2 }];
                    var currentDate = kendo.toString(this.current(), "yyyy/MM/dd");

                    the.authService.AuthGet(`${the.share.apiCrm}WorkbenchUser/GetTaskCount/`, { date: currentDate }).subscribe(res => {
                        let tasks = res.json();
                        if (tasks.length == 0) return false;
                        $("#calendar").find("td[role=gridcell]").each(function () {
                            var $this = $(this);
                            var sDate = $this.find("a").attr("title").replace(/[年月]/g, "/").replace("日", "");
                            var date = new Date(sDate);
                            //date.setMonth(date.getMonth() + 1);
                            $.each(tasks, function (i, item) {
                                if (+new Date(item.date) == +date) {
                                    $this.find("div.task").append("<span>" + item.amount + "</span>");
                                    $this.find("a").attr("href", "/workbench/tasks/" + kendo.toString(date, "yyyy-MM-dd"));
                                    return false;
                                }
                            });
                            if ($this.find("a").attr("href") == "#")
                                $this.find("a").attr("href", "/workbench/tasks/" + kendo.toString(date, "yyyy-MM-dd"));
                        });
                    });
                }
            });

            var calendar = $("#calendar").data("kendoCalendar");
            calendar.navigate();

            $("#calendarBtn").off('click').on('click',function () {
                $("#calendarBox").toggle();
            });

            the.closeDialog = $("#dialog").kendoDialog({
                width: "400px",
                title: "提示",
                closable: true,
                modal: false,
                content: '<p class="ma-t20 ma-b30 text-center">确认关闭任务？<p>',
                actions: [
                    { text: '取消' },
                    { 
                        text: '确认', primary: true, 
                        action: function(){
                            the.authService.AuthPost(`${the.share.apiCrm}workbenchuser/ModifyTaskStatus/?id=${the.taskid}&status=0`, null).subscribe(res => {
                                let data = res.json();
                                if (data.actionResult) {
                                    $("#" + the.taskid).find(".icon-guanbipsd,.icon-duihao").hide();
                                    $("#" + the.taskid).find(".ma-r60").attr("class", "float-r ma-r60 color-9").text("已关闭");
                                } else {
                                    alert("操作失败!");
                                }
                            });
                        } 
                    }
                ],
            }).data("kendoDialog");

            the.closeDialog.close();

            the.delDialog = $("#removedialog").kendoDialog({
                width: "400px",
                title: "提示",
                closable: true,
                modal: false,
                content: '<p class="ma-t20 ma-b30 text-center">确认删除任务？<p>',
                actions: [
                    { text: '取消' },
                    { 
                        text: '确认', primary: true, 
                        action: function(){
                            the.authService.AuthPost(`${the.share.apiCrm}workbenchuser/RemoveSellerTask/?id=${the.taskid}`,null).subscribe(res => {
                                let data = res.json();
                                if (data.actionResult) {
                                    $("#" + the.taskid).remove();
                                } else {
                                    alert("操作失败!");
                                }
                            });
                        }
                    }
                ],
            }).data("kendoDialog");

            the.delDialog.close();

        }
    }
}